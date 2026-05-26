import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import styles from './GradesPage.module.css';

interface GradeItem {
  id: number;
  subject_name: string;
  student_name: string;
  student: number;
  subject: number;
  value: number;
  date_assigned: string;
  lecturer_name: string;
}

interface StudentItem {
  id: number;
  user: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  semester: number;
  field_of_study: number | null;
  field_of_study_name: string;
  subjects: number[];
  subjects_names: string[];
}

interface SubjectItem {
  id: number;
  name: string;
  semester: number;
  field_of_study: number;
}

export function GradesPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const isLecturer = user?.role === 'lecturer';
  const isStudent = user?.role === 'student';

  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState('4.0');
  const [availableSubjects, setAvailableSubjects] = useState<SubjectItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isLecturer) {
          const [studentsData, subjectsData, gradesData] = await Promise.all([
            apiService.getMyStudents(),
            apiService.getSubjects(),
            apiService.getGrades(),
          ]);
          setStudents(Array.isArray(studentsData) ? studentsData : []);
          setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
          setGrades(Array.isArray(gradesData) ? gradesData : []);
        } else if (isStudent) {
          const gradesData = await apiService.getGrades();
          setGrades(Array.isArray(gradesData) ? gradesData : []);
        }
      } catch (e) {
        setError('Nie udało się załadować danych');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLecturer, isStudent]);

  useEffect(() => {
    if (selectedStudent && isLecturer) {
      const student = students.find(s => s.id === selectedStudent);
      if (student) {
        const filtered = subjects.filter(
          s => s.field_of_study === student.field_of_study && s.semester === student.semester
        );
        setAvailableSubjects(filtered);
      } else {
        setAvailableSubjects([]);
      }
      setSelectedSubject(null);
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedStudent, students, subjects, isLecturer]);

  const handleAddGrade = async () => {
    if (!selectedStudent || !selectedSubject) {
      alert('Wybierz studenta i przedmiot');
      return;
    }
    const val = parseFloat(gradeValue);
    if (isNaN(val) || val < 2 || val > 5) {
      alert('Ocena musi być w zakresie 2–5');
      return;
    }
    try {
      const created = await apiService.createGrade({
        student: selectedStudent,
        subject: selectedSubject,
        value: val,
      });
      setGrades(prev => [created, ...prev]);
      setSelectedStudent(null);
      setSelectedSubject(null);
      setGradeValue('4.0');
    } catch (e) {
      alert('Błąd: ' + (e as Error).message);
    }
  };

  const handleDeleteGrade = async (id: number) => {
    if (!confirm('Na pewno usunąć tę ocenę?')) return;
    try {
      await apiService.deleteGrade(id);
      setGrades(prev => prev.filter(g => g.id !== id));
    } catch (e) {
      alert('Nie udało się usunąć oceny');
    }
  };

  const groupedBySubject = grades.reduce<Record<string, GradeItem[]>>((acc, g) => {
    if (!acc[g.subject_name]) acc[g.subject_name] = [];
    acc[g.subject_name].push(g);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.subtext1, textAlign: 'center', padding: '3rem' }}>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.red, textAlign: 'center', padding: '3rem' }}>{error}</p>
      </div>
    );
  }

  if (isLecturer) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title} style={{ color: colors.text }}>Wystawianie ocen</h1>

        <div className={styles.addGradeCard} style={{ backgroundColor: colors.mantle }}>
          <h3 style={{ color: colors.text, margin: '0 0 0.75rem', fontSize: '1rem' }}>Nowa ocena</h3>
          <div className={styles.addForm}>
            <select
              value={selectedStudent ?? ''}
              onChange={e => setSelectedStudent(Number(e.target.value))}
              style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }}
            >
              <option value="">— Wybierz studenta —</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.user_first_name} {s.user_last_name} ({s.field_of_study_name})</option>
              ))}
            </select>
            <select
              value={selectedSubject ?? ''}
              onChange={e => setSelectedSubject(Number(e.target.value))}
              style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }}
              disabled={availableSubjects.length === 0}
            >
              <option value="">— Wybierz przedmiot —</option>
              {availableSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input
              type="number"
              min="2"
              max="5"
              step="0.5"
              value={gradeValue}
              onChange={e => setGradeValue(e.target.value)}
              style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2, width: '80px' }}
            />
            <button onClick={handleAddGrade} className={styles.addBtn} style={{ backgroundColor: colors.green, color: '#fff' }}>
              + Dodaj
            </button>
          </div>
        </div>

        <div className={styles.gradesTable} style={{ backgroundColor: colors.mantle }}>
          <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0, color: colors.subtext1 }}>
            <span>Student</span>
            <span>Przedmiot</span>
            <span>Ocena</span>
            <span>Data</span>
            <span></span>
          </div>
          {grades.length === 0 ? (
            <p style={{ color: colors.subtext0, padding: '1rem' }}>Brak wystawionych ocen</p>
          ) : (
            grades.map(g => (
              <div key={g.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
                <span style={{ color: colors.text }}>{g.student_name}</span>
                <span style={{ color: colors.text }}>{g.subject_name}</span>
                <span style={{ color: colors.blue, fontWeight: 600 }}>{g.value.toFixed(1)}</span>
                <span style={{ color: colors.subtext0, fontSize: '0.85rem' }}>{new Date(g.date_assigned).toLocaleDateString('pl-PL')}</span>
                <button onClick={() => handleDeleteGrade(g.id)} className={styles.deleteBtn} style={{ color: colors.red }}>Usuń</button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title} style={{ color: colors.text }}>Oceny</h1>
        <div className={styles.emptyState} style={{ backgroundColor: colors.mantle }}>
          <p style={{ color: colors.subtext0 }}>Sekcja ocen dostępna tylko dla studentów i wykładowców.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ color: colors.text }}>Oceny</h1>
      {grades.length === 0 ? (
        <div className={styles.emptyState} style={{ backgroundColor: colors.mantle }}>
          <p style={{ color: colors.subtext0 }}>Brak ocen</p>
        </div>
      ) : (
        <div className={styles.subjectGrades}>
          {Object.entries(groupedBySubject).map(([subjectName, subjectGrades]) => {
            const avg = subjectGrades.reduce((s, g) => s + g.value, 0) / subjectGrades.length;
            return (
              <div key={subjectName} className={styles.subjectBlock} style={{ backgroundColor: colors.mantle }}>
                <div className={styles.subjectHeader}>
                  <h3 style={{ color: colors.text, margin: 0, fontSize: '1rem' }}>{subjectName}</h3>
                  <span className={styles.subjectAvg} style={{ color: colors.green }}>
                    Ø {avg.toFixed(2)}
                  </span>
                </div>
                <div className={styles.gradeList}>
                  {subjectGrades.map(g => (
                    <div key={g.id} className={styles.gradeItem} style={{ borderColor: colors.surface2 }}>
                      <span style={{ color: colors.blue, fontWeight: 600, fontSize: '1.1rem' }}>{g.value.toFixed(1)}</span>
                      <span style={{ color: colors.subtext0, fontSize: '0.8rem' }}>
                        {new Date(g.date_assigned).toLocaleDateString('pl-PL')}
                      </span>
                      <span style={{ color: colors.subtext1, fontSize: '0.85rem' }}>{g.lecturer_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}