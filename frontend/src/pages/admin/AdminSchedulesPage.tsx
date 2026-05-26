import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminPage.module.css';

interface ScheduleData {
  id: number;
  subject: number;
  subject_name: string;
  lecturer: number;
  lecturer_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string;
}

interface SubjectData {
  id: number;
  name: string;
  semester: number;
  field_of_study: number;
  field_of_study_name: string;
}

interface LecturerData {
  id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
}

interface FieldData {
  id: number;
  name: string;
  num_semesters: number;
}

const DAYS = [
  { value: 'MON', label: 'Poniedziałek' },
  { value: 'TUE', label: 'Wtorek' },
  { value: 'WED', label: 'Środa' },
  { value: 'THU', label: 'Czwartek' },
  { value: 'FRI', label: 'Piątek' },
  { value: 'SAT', label: 'Sobota' },
];

export function AdminSchedulesPage() {
  const { colors } = useTheme();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({ subject: 0, lecturer: 0, day_of_week: 'MON', start_time: '08:00', end_time: '09:30', room: '' });
  const [editing, setEditing] = useState(false);

  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [semesters, setSemesters] = useState<number[]>([]);

  const fetch = async () => {
    try {
      const [sched, subj, lect, flds] = await Promise.all([
        apiService.getAdminSchedule(),
        apiService.getSubjects(),
        apiService.getLecturers(),
        apiService.getFields(),
      ]);
      setSchedules(sched);
      setSubjects(subj);
      setLecturers(lect);
      setFields(flds);
      if (flds.length > 0 && !selectedField) {
        setSelectedField(flds[0].id);
        setSemesters(Array.from({ length: flds[0].num_semesters }, (_, i) => i + 1));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  useEffect(() => {
    if (selectedField) {
      const field = fields.find(f => f.id === selectedField);
      setSemesters(field ? Array.from({ length: field.num_semesters }, (_, i) => i + 1) : []);
      if (selectedSemester > (field?.num_semesters || 1)) {
        setSelectedSemester(1);
      }
    }
  }, [selectedField, fields]);

  const filteredSubjects = subjects.filter(s =>
    s.field_of_study === selectedField && s.semester === selectedSemester
  );

  const filteredSchedules = schedules.filter(s => {
    const subj = subjects.find(sub => sub.id === s.subject);
    return subj && subj.field_of_study === selectedField && subj.semester === selectedSemester;
  });

  const openCreate = () => {
    const firstSubj = filteredSubjects[0];
    setForm({
      subject: firstSubj?.id || 0,
      lecturer: lecturers[0]?.id || 0,
      day_of_week: 'MON',
      start_time: '08:00',
      end_time: '09:30',
      room: ''
    });
    setEditing(false);
    setModal(true);
  };

  const openEdit = (s: ScheduleData) => {
    setForm({ ...s, subject: s.subject, lecturer: s.lecturer });
    setEditing(true);
    setModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) await apiService.updateSchedule(form.id, form);
      else await apiService.createSchedule(form);
      setModal(false);
      fetch();
    } catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Na pewno usunąć?')) return;
    try { await apiService.deleteSchedule(id); fetch(); }
    catch (e) { alert('Błąd: ' + (e as Error).message); }
  };

  const dayLabel = (v: string) => DAYS.find(d => d.value === v)?.label || v;

  if (loading) return <div style={{ color: colors.text }}>Ładowanie...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ color: colors.text }}>Plan zajęć</h1>
        <button className={styles.addBtn} style={{ backgroundColor: colors.blue }} onClick={openCreate} disabled={filteredSubjects.length === 0}>+ Nowe zajęcia</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className={styles.field} style={{ minWidth: 200 }}>
          <label style={{ color: colors.subtext1, display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Kierunek</label>
          <select
            style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2, padding: '8px 12px', borderRadius: 8, border: '1px solid', width: '100%' }}
            value={selectedField ?? ''}
            onChange={e => setSelectedField(Number(e.target.value))}
          >
            {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className={styles.field} style={{ minWidth: 120 }}>
          <label style={{ color: colors.subtext1, display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Semestr</label>
          <select
            style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2, padding: '8px 12px', borderRadius: 8, border: '1px solid', width: '100%' }}
            value={selectedSemester}
            onChange={e => setSelectedSemester(Number(e.target.value))}
          >
            {semesters.map(s => <option key={s} value={s}>Semestr {s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.table} style={{ borderColor: colors.surface2 }}>
        <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
          <span style={{ color: colors.subtext1 }}>Przedmiot</span>
          <span style={{ color: colors.subtext1 }}>Wykładowca</span>
          <span style={{ color: colors.subtext1 }}>Dzień</span>
          <span style={{ color: colors.subtext1 }}>Godzina</span>
          <span style={{ color: colors.subtext1 }}>Sala</span>
          <span style={{ color: colors.subtext1 }}>Akcje</span>
        </div>
        {filteredSchedules.length === 0 ? (
          <div className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
            <span style={{ color: colors.subtext0, gridColumn: '1 / -1', textAlign: 'center', padding: '1rem' }}>
              Brak zajęć dla tego kierunku i semestru
            </span>
          </div>
        ) : (
          filteredSchedules.map(s => (
            <div key={s.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
              <span style={{ color: colors.text }}>{s.subject_name}</span>
              <span style={{ color: colors.text }}>{s.lecturer_name}</span>
              <span style={{ color: colors.text }}>{dayLabel(s.day_of_week)}</span>
              <span style={{ color: colors.text }}>{s.start_time} - {s.end_time}</span>
              <span style={{ color: colors.text }}>{s.room}</span>
              <div className={styles.actions}>
                <button className={styles.editBtn} style={{ color: colors.blue }} onClick={() => openEdit(s)}>Edytuj</button>
                <button className={styles.deleteBtn} style={{ color: colors.red }} onClick={() => handleDelete(s.id)}>Usuń</button>
              </div>
            </div>
          ))
        )}
      </div>

      {modal && (
        <div className={styles.modal} onClick={() => setModal(false)}>
          <div className={styles.modalContent} style={{ backgroundColor: colors.mantle }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: colors.text }}>{editing ? 'Edytuj' : 'Nowe'} zajęcia</h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Przedmiot</label>
                <select style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.subject} onChange={e => setForm({ ...form, subject: Number(e.target.value) })}>
                  {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Wykładowca</label>
                <select style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.lecturer} onChange={e => setForm({ ...form, lecturer: Number(e.target.value) })}>
                  {lecturers.map(l => <option key={l.id} value={l.id}>{l.user_first_name} {l.user_last_name}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Dzień</label>
                <select style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })}>
                  {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Godzina rozpoczęcia</label>
                <input type="time" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Godzina zakończenia</label>
                <input type="time" style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label style={{ color: colors.subtext1 }}>Sala</label>
                <input style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }} value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
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