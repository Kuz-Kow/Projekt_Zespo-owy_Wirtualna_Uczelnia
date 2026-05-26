import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import styles from './SchedulePage.module.css';

interface ScheduleItem {
  id: number;
  subject_name: string;
  lecturer_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string;
}

interface GradeItem {
  id: number;
  subject_name: string;
  value: number;
  date_assigned: string;
}

const dayLabels: Record<string, string> = {
  'MON': 'Poniedziałek', 'TUE': 'Wtorek', 'WED': 'Środa', 'THU': 'Czwartek', 'FRI': 'Piątek',
};

const dayShort: Record<string, string> = {
  'MON': 'Pn', 'TUE': 'Wt', 'WED': 'Śr', 'THU': 'Cz', 'FRI': 'Pt',
};

const DAY_ORDER = ['MON', 'TUE', 'WED', 'THU', 'FRI'] as const;

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 7; hour <= 20; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function timeToIndex(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - 7) * 2 + (m >= 30 ? 1 : 0);
}

const subjectColors = [
  '#1E66F5', '#40A02B', '#DF8E1D', '#D20F39', '#8839EF',
  '#04A5E5', '#EA76CB', '#FE640B', '#179299', '#E64553',
];

function getSubjectColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return subjectColors[Math.abs(hash) % subjectColors.length];
}

export function SchedulePage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getSchedule();
        setSchedules(Array.isArray(data) ? data : []);

        if (user?.role === 'student') {
          try {
            const gradesData = await apiService.getGrades();
            setGrades(Array.isArray(gradesData) ? gradesData : []);
          } catch {}
        }
      } catch (e) {
        setError('Nie udało się załadować planu');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    for (const day of DAY_ORDER) {
      map.set(day, schedules.filter(s => s.day_of_week === day).sort((a, b) => a.start_time.localeCompare(b.start_time)));
    }
    return map;
  }, [schedules]);

  const occupiedSlots = useMemo(() => {
    const slots = new Set<string>();
    for (const s of schedules) {
      const startIdx = timeToIndex(s.start_time);
      const endIdx = timeToIndex(s.end_time);
      for (let i = startIdx; i < endIdx; i++) {
        slots.add(`${s.day_of_week}-${i}`);
      }
    }
    return slots;
  }, [schedules]);

  const today = new Date();
  const dayMap: Record<number, string> = { 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT', 0: 'SUN' };
  const todayCode = dayMap[today.getDay()];
  const currentDay = today.getDay();

  const dayDates = useMemo(() => {
    const monday = new Date(today);
    monday.setDate(monday.getDate() - ((currentDay + 6) % 7));
    return DAY_ORDER.map((_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDay]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.subtext1, textAlign: 'center', padding: '3rem' }}>Ładowanie planu...</p>
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

  const hasSchedule = schedules.length > 0;

  const subjectColorsMap = new Map<string, string>();
  schedules.forEach(s => {
    if (!subjectColorsMap.has(s.subject_name)) {
      subjectColorsMap.set(s.subject_name, getSubjectColor(s.subject_name));
    }
  });

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className={styles.title} style={{ color: colors.text, margin: 0 }}>Plan zajęć</h1>
        <span style={{ color: colors.subtext0, fontSize: '0.85rem', background: colors.surface0, padding: '4px 12px', borderRadius: 20 }}>
          Tydzień: {dayDates[0].toLocaleDateString('pl-PL')} – {dayDates[4].toLocaleDateString('pl-PL')}
        </span>
      </div>

      {grades.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {grades.filter(g => {
            const sched = schedules.find(s => s.subject_name === g.subject_name);
            return !!sched;
          }).slice(0, 5).map(g => (
            <div key={g.id} style={{
              background: colors.surface0,
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ color: colors.text }}>{g.subject_name}</span>
              <span style={{ color: colors.green, fontWeight: 700 }}>{g.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}

      {!hasSchedule ? (
        <div className={styles.emptyState} style={{ backgroundColor: colors.mantle }}>
          <p style={{ color: colors.subtext0 }}>Brak zaplanowanych zajęć</p>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className={styles.mobileView}>
            {DAY_ORDER.map(day => {
              const lessons = groupedByDay.get(day) || [];
              const isToday = day === todayCode;
              return (
                <div key={day} className={styles.mobileDayCard} style={{
                  backgroundColor: colors.mantle,
                  borderColor: isToday ? colors.blue : colors.surface2,
                }}>
                  <div className={styles.mobileDayHeader} style={{
                    backgroundColor: isToday ? colors.blue : colors.surface0,
                    color: isToday ? '#fff' : colors.text,
                  }}>
                    <span style={{ fontWeight: 700 }}>{dayLabels[day]}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{lessons.length > 0 ? `${lessons.length} zajęć` : '—'}</span>
                  </div>
                  <div className={styles.mobileLessons}>
                    {lessons.length > 0 ? lessons.map(lesson => {
                      const color = subjectColorsMap.get(lesson.subject_name) || colors.blue;
                      return (
                        <div key={lesson.id} className={styles.mobileLesson} style={{
                          borderLeftColor: color,
                          backgroundColor: colors.surface0,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color, fontWeight: 700, fontSize: '0.75rem' }}>
                              {lesson.start_time.slice(0, 5)}–{lesson.end_time.slice(0, 5)}
                            </span>
                            <span style={{ color: colors.subtext0, fontSize: '0.75rem' }}>📍 {lesson.room || '—'}</span>
                          </div>
                          <span style={{ color: colors.text, fontWeight: 600, fontSize: '0.9rem', marginTop: 2 }}>
                            {lesson.subject_name}
                          </span>
                          <span style={{ color: colors.subtext1, fontSize: '0.75rem' }}>
                            {lesson.lecturer_name}
                          </span>
                        </div>
                      );
                    }) : (
                      <div style={{ padding: '0.75rem', textAlign: 'center', color: colors.subtext0, fontSize: '0.85rem' }}>
                        Brak zajęć
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop timetable grid */}
          <div className={styles.timetable}>
            <div className={styles.ttHeader}>
              <div className={styles.ttTimeCol}>
                <span style={{ color: colors.subtext1, fontSize: '0.75rem', fontWeight: 600 }}>Godzina</span>
              </div>
              {DAY_ORDER.map((day, i) => {
                const isToday = day === todayCode;
                return (
                  <div key={day} className={styles.ttDayCol} style={{
                    backgroundColor: isToday ? colors.surface0 : 'transparent',
                  }}>
                    <span style={{
                      color: isToday ? colors.blue : colors.subtext1,
                      fontWeight: isToday ? 700 : 600,
                      fontSize: '0.8rem',
                    }}>{dayShort[day]}</span>
                    <span style={{
                      color: isToday ? colors.blue : colors.subtext0,
                      fontSize: '0.7rem',
                    }}>{dayDates[i].getDate()}.{dayDates[i].getMonth() + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className={styles.ttBody}>
              {TIME_SLOTS.map((time, idx) => {
                const [, m] = time.split(':');
                const isHour = m === '00';
                return (
                  <div key={time} className={styles.ttRow} style={{
                    borderBottom: isHour ? `1px solid ${colors.surface2}` : `1px solid ${colors.surface0}`,
                    minHeight: isHour ? 48 : 24,
                  }}>
                    <div className={styles.ttTimeCol} style={{
                      borderRight: `1px solid ${colors.surface2}`,
                    }}>
                      {isHour && (
                        <span style={{ color: colors.subtext0, fontSize: '0.7rem', fontWeight: 500 }}>{time}</span>
                      )}
                    </div>
                    {DAY_ORDER.map(day => {
                      const slotKey = `${day}-${idx}`;
                      const isOccupied = occupiedSlots.has(slotKey);
                      const lesson = isOccupied ? groupedByDay.get(day)?.find(s => {
                        const sIdx = timeToIndex(s.start_time);
                        const eIdx = timeToIndex(s.end_time);
                        return idx >= sIdx && idx < eIdx;
                      }) : null;

                      if (!lesson) {
                        return <div key={day} className={styles.ttDayCol} />;
                      }

                      const sIdx = timeToIndex(lesson.start_time);
                      const eIdx = timeToIndex(lesson.end_time);
                      const isFirst = idx === sIdx;
                      const color = subjectColorsMap.get(lesson.subject_name) || colors.blue;

                      if (!isFirst) return <div key={day} className={styles.ttDayCol} />;

                      return (
                        <div
                          key={day}
                          className={styles.ttEvent}
                          style={{
                            backgroundColor: `${color}18`,
                            borderLeft: `3px solid ${color}`,
                            gridRow: `span ${eIdx - sIdx}`,
                          }}
                        >
                          <span style={{ color, fontWeight: 700, fontSize: '0.7rem' }}>
                            {lesson.start_time.slice(0, 5)}–{lesson.end_time.slice(0, 5)}
                          </span>
                          <span style={{ color: colors.text, fontWeight: 600, fontSize: '0.8rem', marginTop: 1 }}>
                            {lesson.subject_name}
                          </span>
                          <span style={{ color: colors.subtext1, fontSize: '0.7rem' }}>
                            {lesson.lecturer_name}
                          </span>
                          <span style={{ color: colors.subtext0, fontSize: '0.65rem' }}>
                            📍 {lesson.room || '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}