import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminPage.module.css';

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  index_number: string;
  academic_title: string;
  is_staff: boolean;
}

const emptyUser: UserData = {
  id: 0,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  role: 'student',
  index_number: '',
  academic_title: '',
  is_staff: false,
};

export function AdminUsersPage() {
  const { colors } = useTheme();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<UserData>(emptyUser);
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setForm(emptyUser);
    setPassword('');
    setEditing(false);
    setModal(true);
  };

  const openEdit = (u: UserData) => {
    setForm(u);
    setPassword('');
    setEditing(true);
    setModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await apiService.updateUser(form.id, form);
      } else {
        await apiService.createUser({ ...form, password: password || 'changeme123' });
      }
      setModal(false);
      fetchUsers();
    } catch (e) {
      alert('Błąd zapisu: ' + (e as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Na pewno usunąć tego użytkownika?')) return;
    try {
      await apiService.deleteUser(id);
      fetchUsers();
    } catch (e) {
      alert('Błąd usuwania: ' + (e as Error).message);
    }
  };

  if (loading) return <div style={{ color: colors.text }}>Ładowanie...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ color: colors.text }}>Zarządzanie użytkownikami</h1>
        <button className={styles.addBtn} style={{ backgroundColor: colors.blue }} onClick={openCreate}>
          + Nowy użytkownik
        </button>
      </div>

      <div className={styles.table} style={{ borderColor: colors.surface2 }}>
        <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
          <span>Nazwa</span>
          <span>Email</span>
          <span>Imię</span>
          <span>Nazwisko</span>
          <span>Rola</span>
          <span>Akcje</span>
        </div>
        {users.map(u => (
          <div key={u.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
            <span style={{ color: colors.text }}>{u.username}</span>
            <span style={{ color: colors.text }}>{u.email}</span>
            <span style={{ color: colors.text }}>{u.first_name}</span>
            <span style={{ color: colors.text }}>{u.last_name}</span>
            <span style={{ color: colors.blue }}>{u.role}</span>
            <div className={styles.actions}>
              <button className={styles.editBtn} style={{ color: colors.blue }} onClick={() => openEdit(u)}>Edytuj</button>
              <button className={styles.deleteBtn} style={{ color: colors.red }} onClick={() => handleDelete(u.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className={styles.modal} onClick={() => setModal(false)}>
          <div className={styles.modalContent} style={{ backgroundColor: colors.mantle }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: colors.text }}>{editing ? 'Edytuj' : 'Nowy'} użytkownik</h2>
            <div className={styles.form}>
              {[
                { label: 'Nazwa użytkownika', key: 'username' },
                { label: 'Email', key: 'email' },
                { label: 'Imię', key: 'first_name' },
                { label: 'Nazwisko', key: 'last_name' },
                { label: 'Numer indeksu', key: 'index_number' },
                { label: 'Tytuł naukowy', key: 'academic_title' },
              ].map(f => (
                <div key={f.key} className={styles.field}>
                  <label style={{ color: colors.subtext1 }}>{f.label}</label>
                  <input
                    style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              {!editing && (
                <div className={styles.field}>
                  <label style={{ color: colors.subtext1 }}>Hasło</label>
                  <input
                    style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Zostaw puste dla domyślnego"
                  />
                </div>
              )}
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Rola</label>
                <select
                  style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }}
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value, is_staff: e.target.value === 'admin' })}
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Wykładowca</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} style={{ backgroundColor: colors.surface0, color: colors.text }} onClick={() => setModal(false)}>Anuluj</button>
              <button className={styles.saveBtn} style={{ backgroundColor: colors.blue, color: '#fff' }} onClick={handleSave}>Zapisz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
