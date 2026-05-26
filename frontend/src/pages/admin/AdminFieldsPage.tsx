import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminPage.module.css';

interface FieldData {
  id: number;
  name: string;
  faculty: string;
  num_semesters: number;
}

export function AdminFieldsPage() {
  const { colors } = useTheme();
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<FieldData>({ id: 0, name: '', faculty: '', num_semesters: 3 });
  const [editing, setEditing] = useState(false);

  const fetch = async () => {
    try {
      const data = await apiService.getFields();
      setFields(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ id: 0, name: '', faculty: '', num_semesters: 3 }); setEditing(false); setModal(true); };
  const openEdit = (f: FieldData) => { setForm(f); setEditing(true); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) await apiService.updateField(form.id, form);
      else await apiService.createField(form);
      setModal(false);
      fetch();
    } catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Na pewno usunąć?')) return;
    try { await apiService.deleteField(id); fetch(); }
    catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  if (loading) return <div style={{ color: colors.text }}>Ładowanie...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ color: colors.text }}>Kierunki studiów</h1>
        <button className={styles.addBtn} style={{ backgroundColor: colors.blue }} onClick={openCreate}>+ Nowy kierunek</button>
      </div>
      <div className={styles.table} style={{ borderColor: colors.surface2 }}>
        <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
          <span style={{ color: colors.subtext1 }}>Nazwa</span>
          <span style={{ color: colors.subtext1 }}>Wydział</span>
          <span style={{ color: colors.subtext1 }}>Semestrów</span>
          <span style={{ color: colors.subtext1 }}>Akcje</span>
        </div>
        {fields.map(f => (
          <div key={f.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
            <span style={{ color: colors.text }}>{f.name}</span>
            <span style={{ color: colors.text }}>{f.faculty}</span>
            <span style={{ color: colors.text }}>{f.num_semesters}</span>
            <div className={styles.actions}>
              <button className={styles.editBtn} style={{ color: colors.blue }} onClick={() => openEdit(f)}>Edytuj</button>
              <button className={styles.deleteBtn} style={{ color: colors.red }} onClick={() => handleDelete(f.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className={styles.modal} onClick={() => setModal(false)}>
          <div className={styles.modalContent} style={{ backgroundColor: colors.mantle }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: colors.text }}>{editing ? 'Edytuj' : 'Nowy'} kierunek</h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Nazwa</label>
                <input style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Wydział</label>
                <input style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Liczba semestrów</label>
                <input type="number" min="1" max="10" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.num_semesters} onChange={e => setForm({ ...form, num_semesters: Number(e.target.value) })} />
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
