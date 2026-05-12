import { useTheme } from '../context/ThemeContext';
import styles from './StudiesPage.module.css';

const mockSubjects = [
  { id: 1, name: 'Matematyka dyskretna', teacher: 'dr Anna Kowalska', credits: 5, grade: 4.5 },
  { id: 2, name: 'Programowanie obiektowe', teacher: 'prof. Jan Nowak', credits: 6, grade: 5.0 },
  { id: 3, name: 'Bazy danych', teacher: 'dr Piotr Wiśniewski', credits: 4, grade: 4.0 },
  { id: 4, name: 'Algorytmy i struktury danych', teacher: 'prof. Ewa Lewandowska', credits: 6, grade: 4.0 },
];

export function StudiesPage() {
  const { colors } = useTheme();

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ color: colors.text }}>Studia</h1>

      <div className={styles.summary} style={{ backgroundColor: colors.mantle }}>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: colors.blue }}>4.38</span>
          <span className={styles.statLabel} style={{ color: colors.subtext1 }}>Średnia ocen</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: colors.green }}>{mockSubjects.length}</span>
          <span className={styles.statLabel} style={{ color: colors.subtext1 }}>Przedmioty</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: colors.peach }}>21</span>
          <span className={styles.statLabel} style={{ color: colors.subtext1 }}>Punkty ECTS</span>
        </div>
      </div>

      <div className={styles.subjects}>
        <h2 className={styles.subtitle} style={{ color: colors.text }}>Przedmioty</h2>
        {mockSubjects.map(subject => (
          <div key={subject.id} className={styles.subjectCard} style={{ backgroundColor: colors.mantle }}>
            <div className={styles.subjectInfo}>
              <h3 style={{ color: colors.text }}>{subject.name}</h3>
              <p style={{ color: colors.subtext1 }}>{subject.teacher}</p>
              <span className={styles.credits} style={{ color: colors.blue }}>{subject.credits} ECTS</span>
            </div>
            <div className={styles.subjectGrade} style={{ backgroundColor: colors.surface0 }}>
              <span style={{ color: colors.text }}>{subject.grade.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
