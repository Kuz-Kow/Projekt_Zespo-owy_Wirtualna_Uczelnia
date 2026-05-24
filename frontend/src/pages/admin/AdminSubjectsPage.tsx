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
}

interface FieldData {
  id: number;
  name: string;
}

export function AdminSubjectsPage() {
  const { colors } = useTheme();
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<SubjectData>({ id: 0, name: '', hours: 30, semester: 1, field_of_study: 0 });
  const [editing, setEditing] = useState(false);

  const fetch = async () => {
    try {
      const [subjData, fieldsData] = await Promise.all([apiService.getSubjects(), apiService.getFields()]);
      setSubjects(subjData);
      setFields(fieldsData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm({ id: 0, name: '', hours: 30, semester: 1, field_of_study: fields[0]?.id || 0 }); setEditing(false); setModal(true); };
  const openEdit = (s: SubjectData) => { setForm(s); setEditing(true); setModal(true); };

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

  if (loading) return <div style={{ color: colors.text }}>Ładowanie...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ color: colors.text }}>Przedmioty</h1>
        <button className={styles.addBtn} style={{ backgroundColor: colors.blue }} onClick={openCreate}>+ Nowy przedmiot</button>
      </div>
      <div className={styles.table} style={{ borderColor: colors.surface2 }}>
        <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
          <span>Nazwa</span>
          <span>Godziny</span>
          <span>Semestr</span>
          <span>Kierunek</span>
          <span>Akcje</span>
        </div>
        {subjects.map(s => (
          <div key={s.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
            <span style={{ color: colors.text }}>{s.name}</span>
            <span style={{ color: colors.text }}>{s.hours}</span>
            <span style={{ color: colors.text }}>{s.semester}</span>
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
                <input type="number" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.semester} onChange={e => setForm({ ...form, semester: Number(e.target.value) })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Kierunek</label>
                <select style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.field_of_study} onChange={e => setForm({ ...form, field_of_study: Number(e.target.value) })}>
                  {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
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
