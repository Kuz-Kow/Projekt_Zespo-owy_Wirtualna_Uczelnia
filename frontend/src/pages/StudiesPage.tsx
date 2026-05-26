import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import styles from './StudiesPage.module.css';

interface Subject {
  id: number;
  name: string;
  hours: number;
  semester: number;
  field_of_study_name: string;
}

interface GradeItem {
  id: number;
  subject_name: string;
  value: number;
  date_assigned: string;
}

interface StudentProfile {
  id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  semester: number;
  year: number;
  field_of_study_name: string;
  subjects: number[];
  subjects_names: string[];
}

export function StudiesPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsData, gradesData, studentsData] = await Promise.all([
          apiService.getSubjects(),
          user?.role === 'student' ? apiService.getGrades() : Promise.resolve([]),
          user?.role === 'student' ? apiService.getStudents() : Promise.resolve([]),
        ]);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        setGrades(Array.isArray(gradesData) ? gradesData : []);
        const students = Array.isArray(studentsData) ? studentsData : [];
        if (students.length > 0) {
          setStudentProfile(students[0]);
        }
      } catch (e) {
        setError('Nie udało się załadować danych');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const averageGrade = grades.length > 0
    ? grades.reduce((sum, g) => sum + g.value, 0) / grades.length
    : 0;

  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);

  const subjectGrades = subjects.map(subj => {
    const grade = grades.find(g => g.subject_name === subj.name);
    return { ...subj, grade: grade?.value ?? null };
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.subtext1, textAlign: 'center' }}>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.red, textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ color: colors.text }}>Studia</h1>

      <div className={styles.summary} style={{ backgroundColor: colors.mantle }}>
        {user?.role === 'student' && (
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: colors.blue }}>
              {averageGrade.toFixed(2)}
            </span>
            <span className={styles.statLabel} style={{ color: colors.subtext1 }}>Średnia ocen</span>
          </div>
        )}
        {(user?.role === 'lecturer' || user?.role === 'admin') && (
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: colors.blue }}>—</span>
            <span className={styles.statLabel} style={{ color: colors.subtext1 }}>Średnia ocen</span>
          </div>
        )}
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: colors.green }}>{subjects.length}</span>
          <span className={styles.statLabel} style={{ color: colors.subtext1 }}>Przedmioty</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: colors.peach }}>{totalHours}</span>
          <span className={styles.statLabel} style={{ color: colors.subtext1 }}>Godzin</span>
        </div>
      </div>

      {studentProfile && (
        <div className={styles.summary} style={{ backgroundColor: colors.mantle, marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <span style={{ color: colors.text }}>Kierunek: <strong>{studentProfile.field_of_study_name}</strong></span>
          <span style={{ color: colors.text }}>Rok: <strong>{studentProfile.year}</strong></span>
          <span style={{ color: colors.text }}>Semestr: <strong>{studentProfile.semester}</strong></span>
        </div>
      )}

      <div className={styles.subjects}>
        <h2 className={styles.subtitle} style={{ color: colors.text }}>Przedmioty</h2>
        {subjectGrades.length === 0 ? (
          <p style={{ color: colors.subtext0 }}>Brak przedmiotów</p>
        ) : (
          subjectGrades.map(subject => (
            <div key={subject.id} className={styles.subjectCard} style={{ backgroundColor: colors.mantle }}>
              <div className={styles.subjectInfo}>
                <h3 style={{ color: colors.text }}>{subject.name}</h3>
                <p style={{ color: colors.subtext1 }}>{subject.field_of_study_name} • Semestr {subject.semester}</p>
                <span className={styles.credits} style={{ color: colors.blue }}>{subject.hours} godz.</span>
              </div>
              {user?.role === 'student' && (
                <div className={styles.subjectGrade} style={{ backgroundColor: colors.surface0 }}>
                  <span style={{ color: subject.grade !== null ? colors.text : colors.subtext0 }}>
                    {subject.grade !== null ? subject.grade.toFixed(1) : '—'}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}