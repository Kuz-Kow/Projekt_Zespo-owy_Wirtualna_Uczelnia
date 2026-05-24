import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminPage.module.css';

interface StudentData {
  id: number;
  user: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  semester: number;
  year: number;
  field_of_study: number | null;
  field_of_study_name: string;
  subjects: number[];
  subjects_names: string[];
}

interface FieldData {
  id: number;
  name: string;
}

interface SubjectData {
  id: number;
  name: string;
}

export function AdminStudentsPage() {
  const { colors } = useTheme();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [fields, setFields] = useState<FieldData[]>([]);
  const [allSubjects, setAllSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({ user: 0, semester: 1, year: 1, field_of_study: null, subjects: [] });
  const [editing, setEditing] = useState(false);

  const fetch = async () => {
    try {
      const [s, f, subj] = await Promise.all([apiService.getStudents(), apiService.getFields(), apiService.getSubjects()]);
      setStudents(s);
      setFields(f);
      setAllSubjects(subj);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ user: 0, semester: 1, year: 1, field_of_study: null, subjects: [] }); setEditing(false); setModal(true); };
  const openEdit = (s: StudentData) => { setForm({ ...s, subjects: s.subjects || [] }); setEditing(true); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) await apiService.updateStudent(form.id, form);
      else await apiService.createStudent(form);
      setModal(false);
      fetch();
    } catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Na pewno usunąć?')) return;
    try { await apiService.deleteStudent(id); fetch(); }
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
        <h1 style={{ color: colors.text }}>Studenci</h1>
        <button className={styles.addBtn} style={{ backgroundColor: colors.blue }} onClick={openCreate}>+ Nowy student</button>
      </div>
      <div className={styles.table} style={{ borderColor: colors.surface2 }}>
        <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
          <span>Email</span>
          <span>Imię i nazwisko</span>
          <span>Semestr</span>
          <span>Rok</span>
          <span>Kierunek</span>
          <span>Akcje</span>
        </div>
        {students.map(s => (
          <div key={s.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
            <span style={{ color: colors.text }}>{s.user_email}</span>
            <span style={{ color: colors.text }}>{s.user_first_name} {s.user_last_name}</span>
            <span style={{ color: colors.text }}>{s.semester}</span>
            <span style={{ color: colors.text }}>{s.year}</span>
            <span style={{ color: colors.subtext1 }}>{s.field_of_study_name}</span>
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
            <h2 style={{ color: colors.text }}>{editing ? 'Edytuj' : 'Nowy'} student</h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>ID użytkownika</label>
                <input type="number" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.user} onChange={e => setForm({ ...form, user: Number(e.target.value) })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Semestr</label>
                <input type="number" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.semester} onChange={e => setForm({ ...form, semester: Number(e.target.value) })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Rok</label>
                <input type="number" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Kierunek</label>
                <select style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.field_of_study || ''} onChange={e => setForm({ ...form, field_of_study: e.target.value ? Number(e.target.value) : null })}>
                  <option value="">-- Brak --</option>
                  {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
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
