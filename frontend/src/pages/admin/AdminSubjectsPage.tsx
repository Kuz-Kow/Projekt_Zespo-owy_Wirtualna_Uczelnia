import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminPage.module.css';

interface SubjectData {
  id: number;
  name: string;
  hours: number;
  semester: number;
  field_of_study: number;
  field_of_study_name?: string;
  lecturers: number[];
  lecturers_names: string[];
}

interface FieldData {
  id: number;
  name: string;
}

interface LecturerData {
  id: number;
  user: number;
  user_first_name: string;
  user_last_name: string;
}

export function AdminSubjectsPage() {
  const { colors } = useTheme();
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [fields, setFields] = useState<FieldData[]>([]);
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({ id: 0, name: '', hours: 30, semester: 1, field_of_study: 0, lecturers: [] });
  const [editing, setEditing] = useState(false);

  const fetch = async () => {
    try {
      const [subjData, fieldsData, lectData] = await Promise.all([apiService.getSubjects(), apiService.getFields(), apiService.getLecturers()]);
      setSubjects(subjData);
      setFields(fieldsData);
      setLecturers(lectData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ id: 0, name: '', hours: 30, semester: 1, field_of_study: fields[0]?.id || 0, lecturers: [] }); setEditing(false); setModal(true); };
  const openEdit = (s: SubjectData) => { setForm({ ...s, lecturers: s.lecturers || [] }); setEditing(true); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) await apiService.updateSubject(form.id, form);
      else await apiService.createSubject(form);
      setModal(false);
      fetch();
    } catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Na pewno usunąć?')) return;
    try { await apiService.deleteSubject(id); fetch(); }
    catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const toggleLecturer = (id: number) => {
    setForm((prev: any) => ({
      ...prev,
      lecturers: prev.lecturers.includes(id)
        ? prev.lecturers.filter((l: number) => l !== id)
        : [...prev.lecturers, id]
    }));
  };

  if (loading) return <div style={{ color: colors.text }}>Ładowanie...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ color: colors.text }}>Przedmioty</h1>
        <button className={styles.addBtn} style={{ backgroundColor: colors.blue }} onClick={openCreate}>+ Nowy przedmiot</button>
      </div>
      <div className={styles.table} style={{ borderColor: colors.surface2 }}>
        <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
          <span style={{ color: colors.subtext1 }}>Nazwa</span>
          <span style={{ color: colors.subtext1 }}>Godziny</span>
          <span style={{ color: colors.subtext1 }}>Semestr</span>
          <span style={{ color: colors.subtext1 }}>Kierunek</span>
          <span style={{ color: colors.subtext1 }}>Wykładowcy</span>
          <span style={{ color: colors.subtext1 }}>Akcje</span>
        </div>
        {subjects.map(s => (
          <div key={s.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
            <span style={{ color: colors.text }}>{s.name}</span>
            <span style={{ color: colors.text }}>{s.hours}</span>
            <span style={{ color: colors.text }}>{s.semester}</span>
            <span style={{ color: colors.text }}>{s.field_of_study_name}</span>
            <span style={{ color: colors.subtext1, fontSize: '0.85rem' }}>{s.lecturers_names?.join(', ') || '—'}</span>
            <div className={styles.actions}>
              <button className={styles.editBtn} style={{ color: colors.blue }} onClick={() => openEdit(s)}>Edytuj</button>
              <button className={styles.deleteBtn} style={{ color: colors.red }} onClick={() => handleDelete(s.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div className={styles.modal} onClick={() => setModal(false)}>
          <div className={styles.modalContent} style={{ backgroundColor: colors.mantle }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: colors.text }}>{editing ? 'Edytuj' : 'Nowy'} przedmiot</h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Nazwa</label>
                <input style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Godziny</label>
                <input type="number" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.hours} onChange={e => setForm({ ...form, hours: Number(e.target.value) })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Semestr</label>
                <input type="number" min="1" max="10" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.semester} onChange={e => setForm({ ...form, semester: Number(e.target.value) })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Kierunek</label>
                <select style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.field_of_study} onChange={e => setForm({ ...form, field_of_study: Number(e.target.value) })}>
                  {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Wykładowcy</label>
                <div className={styles.checkboxList}>
                  {lecturers.map(l => (
                    <label key={l.id} style={{ color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={form.lecturers?.includes(l.id)} onChange={() => toggleLecturer(l.id)} />
                      {l.user_first_name} {l.user_last_name}
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