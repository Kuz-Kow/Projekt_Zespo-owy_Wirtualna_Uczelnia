import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import styles from './DashboardPage.module.css';

interface ScheduleItem {
  id: number;
  subject_name: string;
  lecturer_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string | null;
}

interface GradeItem {
  id: number;
  subject_name: string;
  value: number;
  date_assigned: string;
}

interface SubjectItem {
  id: number;
  name: string;
  hours: number;
  semester: number;
}

const dayOrder: Record<string, number> = {
  'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6, 'SUN': 7,
};
const dayLabels: Record<string, string> = {
  'MON': 'Pn', 'TUE': 'Wt', 'WED': 'Śr', 'THU': 'Cz', 'FRI': 'Pt', 'SAT': 'Sb', 'SUN': 'Nd',
};

export function DashboardPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleData, gradesData, subjectsData] = await Promise.all([
          apiService.getSchedule(),
          apiService.getGrades(),
          apiService.getSubjects(),
        ]);
        setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
        setGrades(Array.isArray(gradesData) ? gradesData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (e) {
        console.error('Dashboard fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgGrade = grades.length > 0
    ? grades.reduce((s, g) => s + g.value, 0) / grades.length
    : 0;

  const today = new Date();
  const dayMap: Record<number, string> = { 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT', 0: 'SUN' };
  const todayCode = dayMap[today.getDay()];

  const todaySchedules = schedules
    .filter(s => s.day_of_week === todayCode)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const weekSchedules = [...schedules]
    .filter(s => s.day_of_week !== 'SAT' && s.day_of_week !== 'SUN')
    .sort((a, b) => (dayOrder[a.day_of_week] - dayOrder[b.day_of_week]) || a.start_time.localeCompare(b.start_time));

  const recentGrades = grades.slice(0, 4);

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.subtext1, textAlign: 'center', padding: '3rem' }}>Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcome} style={{ backgroundColor: colors.mantle }}>
        <div>
          <h1 style={{ color: colors.text, margin: 0, fontSize: '1.5rem' }}>
            {user?.role === 'lecturer'
              ? `${user?.academicTitle || ''} ${user?.firstName} ${user?.lastName}`
              : `${user?.firstName} ${user?.lastName}`
            }
          </h1>
          <p style={{ color: colors.subtext1, margin: '0.25rem 0 0' }}>
            {user?.role === 'student' && 'Student'}
            {user?.role === 'lecturer' && 'Wykładowca'}
            {user?.role === 'admin' && 'Administrator'}
          </p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat} style={{ backgroundColor: colors.surface0 }}>
            <span style={{ color: colors.blue, fontSize: '1.25rem', fontWeight: 700 }}>{subjects.length}</span>
            <span style={{ color: colors.subtext0, fontSize: '0.75rem' }}>Przedmioty</span>
          </div>
          {user?.role !== 'lecturer' && (
            <div className={styles.stat} style={{ backgroundColor: colors.surface0 }}>
              <span style={{ color: colors.green, fontSize: '1.25rem', fontWeight: 700 }}>{avgGrade.toFixed(2)}</span>
              <span style={{ color: colors.subtext0, fontSize: '0.75rem' }}>Średnia</span>
            </div>
          )}
          <div className={styles.stat} style={{ backgroundColor: colors.surface0 }}>
            <span style={{ color: colors.peach, fontSize: '1.25rem', fontWeight: 700 }}>{schedules.length}</span>
            <span style={{ color: colors.subtext0, fontSize: '0.75rem' }}>Zajęcia</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card} style={{ backgroundColor: colors.mantle }}>
          <h3 style={{ color: colors.text, margin: '0 0 1rem', fontSize: '1rem' }}>
            📅 Dzisiaj ({dayLabels[todayCode] || '—'})
          </h3>
          {todaySchedules.length > 0 ? (
            todaySchedules.map(s => (
              <div key={s.id} className={styles.lessonRow} style={{ borderColor: colors.surface2 }}>
                <div>
                  <span className={styles.time} style={{ color: colors.blue }}>{s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)}</span>
                  <span className={styles.subjectName} style={{ color: colors.text }}>{s.subject_name}</span>
                </div>
                <span className={styles.room} style={{ color: colors.subtext0 }}>📍 {s.room || '—'}</span>
              </div>
            ))
          ) : (
            <p style={{ color: colors.subtext0, fontSize: '0.9rem' }}>Brak zajęć na dziś</p>
          )}
        </div>

        <div className={styles.card} style={{ backgroundColor: colors.mantle }}>
          <h3 style={{ color: colors.text, margin: '0 0 1rem', fontSize: '1rem' }}>
            📊 Plan tygodnia
          </h3>
          <div className={styles.weekGrid}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI'].map(day => {
              const daySched = weekSchedules.filter(s => s.day_of_week === day);
              return (
                <div key={day} className={styles.dayCol}>
                  <span className={styles.dayLabel} style={{ color: colors.subtext0, fontWeight: 600 }}>{dayLabels[day]}</span>
                  {daySched.length > 0 ? daySched.slice(0, 2).map(s => (
                    <span key={s.id} className={styles.dayLesson} style={{ color: colors.text }}>
                      {s.start_time.slice(0, 5)}<br />{s.subject_name}
                    </span>
                  )) : (
                    <span style={{ color: colors.subtext0, fontSize: '0.75rem' }}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {user?.role === 'student' && recentGrades.length > 0 && (
        <div className={styles.card} style={{ backgroundColor: colors.mantle, marginTop: '1rem' }}>
          <h3 style={{ color: colors.text, margin: '0 0 0.75rem', fontSize: '1rem' }}>
            📝 Ostatnie oceny
          </h3>
          <div className={styles.gradeGrid}>
            {recentGrades.map(g => (
              <div key={g.id} className={styles.gradeChip} style={{ backgroundColor: colors.surface0 }}>
                <span style={{ color: colors.text, fontSize: '0.85rem' }}>{g.subject_name}</span>
                <span style={{ color: colors.green, fontWeight: 700 }}>{g.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
