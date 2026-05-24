import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminPage.module.css';

interface LecturerData {
  id: number;
  user: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  academic_title: string;
  subjects: number[];
  subjects_names: string[];
}

interface SubjectData {
  id: number;
  name: string;
}

export function AdminLecturersPage() {
  const { colors } = useTheme();
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [allSubjects, setAllSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({ user: 0, subjects: [] });
  const [editing, setEditing] = useState(false);

  const fetch = async () => {
    try {
      const [l, s] = await Promise.all([apiService.getLecturers(), apiService.getSubjects()]);
      setLecturers(l);
      setAllSubjects(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ user: 0, subjects: [] }); setEditing(false); setModal(true); };
  const openEdit = (l: LecturerData) => { setForm({ ...l, subjects: l.subjects || [] }); setEditing(true); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) await apiService.updateLecturer(form.id, form);
      else await apiService.createLecturer(form);
      setModal(false);
      fetch();
    } catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Na pewno usunąć?')) return;
    try { await apiService.deleteLecturer(id); fetch(); }
    catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const toggleSubject = (id: number) => {
    setForm((prev: any) => ({
      ...prev,
      subjects: prev.subjects.includes(id)
        ? prev.subjects.filter((s: number) => s !== id)
        : [...prev.subjects, id]
    }));
  };

  if (loading) return <div style={{ color: colors.text }}>Ładowanie...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ color: colors.text }}>Wykładowcy</h1>
        <button className={styles.addBtn} style={{ backgroundColor: colors.blue }} onClick={openCreate}>+ Nowy wykładowca</button>
      </div>
      <div className={styles.table} style={{ borderColor: colors.surface2 }}>
        <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
          <span>Email</span>
          <span>Imię i nazwisko</span>
          <span>Tytuł</span>
          <span>Przedmioty</span>
          <span>Akcje</span>
        </div>
        {lecturers.map(l => (
          <div key={l.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
            <span style={{ color: colors.text }}>{l.user_email}</span>
            <span style={{ color: colors.text }}>{l.user_first_name} {l.user_last_name}</span>
            <span style={{ color: colors.subtext1 }}>{l.academic_title}</span>
            <span style={{ color: colors.subtext1 }}>{l.subjects_names?.join(', ')}</span>
            <div className={styles.actions}>
              <button className={styles.editBtn} style={{ color: colors.blue }} onClick={() => openEdit(l)}>Edytuj</button>
              <button className={styles.deleteBtn} style={{ color: colors.red }} onClick={() => handleDelete(l.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className={styles.modal} onClick={() => setModal(false)}>
          <div className={styles.modalContent} style={{ backgroundColor: colors.mantle }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: colors.text }}>{editing ? 'Edytuj' : 'Nowy'} wykładowca</h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>ID użytkownika</label>
                <input type="number" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.user} onChange={e => setForm({ ...form, user: Number(e.target.value) })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Przedmioty</label>
                <div className={styles.checkboxList}>
                  {allSubjects.map(subj => (
                    <label key={subj.id} style={{ color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={form.subjects?.includes(subj.id)} onChange={() => toggleSubject(subj.id)} />
                      {subj.name}
                    </label>
                  ))}
                </div>
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
