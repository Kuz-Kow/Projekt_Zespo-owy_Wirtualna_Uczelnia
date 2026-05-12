import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './SchedulePage.module.css';

const mockSchedule = {
  student: [
    { day: 'Poniedziałek', lessons: [
      { time: '08:00 - 09:30', name: 'Matematyka dyskretna', room: 'A-101', teacher: 'dr Anna Kowalska' },
      { time: '10:00 - 11:30', name: 'Programowanie obiektowe', room: 'B-203', teacher: 'prof. Jan Nowak' },
    ]},
    { day: 'Środa', lessons: [
      { time: '08:00 - 09:30', name: 'Bazy danych', room: 'C-102', teacher: 'dr Piotr Wiśniewski' },
      { time: '10:00 - 11:30', name: 'Algorytmy i struktury danych', room: 'A-201', teacher: 'prof. Ewa Lewandowska' },
    ]},
    { day: 'Piątek', lessons: [
      { time: '08:00 - 09:30', name: 'Matematyka dyskretna', room: 'A-101', teacher: 'dr Anna Kowalska' },
    ]},
  ],
  teacher: [
    { day: 'Poniedziałek', lessons: [
      { time: '08:00 - 09:30', name: 'Matematyka dyskretna', room: 'A-101', teacher: 'dr Anna Kowalska', groups: ['Informatyka I Rok', 'Matematyka I Rok'] },
      { time: '10:00 - 11:30', name: 'Analiza matematyczna', room: 'A-102', teacher: 'dr Anna Kowalska', groups: ['Informatyka II Rok'] },
    ]},
    { day: 'Środa', lessons: [
      { time: '08:00 - 09:30', name: 'Algebra liniowa', room: 'B-101', teacher: 'dr Anna Kowalska', groups: ['Informatyka I Rok'] },
    ]},
  ],
} as const;

export function SchedulePage() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const schedule = user?.role === 'lecturer' ? mockSchedule.teacher : mockSchedule.student;

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ color: colors.text }}>Plan zajęć</h1>

      <div className={styles.weekNav}>
        <button className={styles.weekBtn} style={{ color: colors.text }}>
          ← Poprzedni tydzień
        </button>
        <span className={styles.weekLabel} style={{ color: colors.subtext1 }}>
          12 - 18 maja 2026
        </span>
        <button className={styles.weekBtn} style={{ color: colors.text }}>
          Następny tydzień →
        </button>
      </div>

      <div className={styles.schedule}>
        {schedule.map(daySchedule => (
          <div key={daySchedule.day} className={styles.dayCard} style={{ backgroundColor: colors.mantle }}>
            <h2 className={styles.dayTitle} style={{ color: colors.blue }}>{daySchedule.day}</h2>
            <div className={styles.lessons}>
              {daySchedule.lessons.map((lesson, idx) => (
                <div key={idx} className={styles.lesson} style={{ borderColor: colors.surface2 }}>
                  <div className={styles.lessonTime} style={{ color: colors.subtext1 }}>
                    {lesson.time}
                  </div>
                  <div className={styles.lessonContent}>
                    <h3 style={{ color: colors.text }}>{lesson.name}</h3>
                    <p style={{ color: colors.subtext1 }}>
                      {user?.role === 'lecturer' 
                        ? `Grupy: ${('groups' in lesson && lesson.groups) ? lesson.groups.join(', ') : ''}`
                        : `Prowadzący: ${lesson.teacher}`
                      }
                    </p>
                    <span className={styles.room} style={{ color: colors.green }}>
                      📍 {lesson.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
