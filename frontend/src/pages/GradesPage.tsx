import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './GradesPage.module.css';

interface Grade {
  id: number;
  studentName: string;
  studentIndex: string;
  subject: string;
  grade: number;
  date: string;
}

const mockGrades: Grade[] = [
  { id: 1, studentName: 'Jan Kowalski', studentIndex: '123456', subject: 'Matematyka dyskretna', grade: 4.5, date: '2026-05-10' },
  { id: 2, studentName: 'Anna Nowak', studentIndex: '123457', subject: 'Matematyka dyskretna', grade: 5.0, date: '2026-05-10' },
  { id: 3, studentName: 'Piotr Wiśniewski', studentIndex: '123458', subject: 'Matematyka dyskretna', grade: 3.5, date: '2026-05-10' },
];

const mockStudentGrades = [
  { subject: 'Matematyka dyskretna', grade: 4.5, date: '2026-05-10', type: 'Egzamin' },
  { subject: 'Programowanie obiektowe', grade: 5.0, date: '2026-05-05', type: 'Kolokwium' },
  { subject: 'Bazy danych', grade: 4.0, date: '2026-04-28', type: 'Praca domowa' },
  { subject: 'Algorytmy i struktury danych', grade: 4.0, date: '2026-04-20', type: 'Egzamin' },
];

export function GradesPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const isTeacher = user?.role === 'teacher';
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ color: colors.text }}>
        {isTeacher ? 'Wystawianie ocen' : 'Oceny'}
      </h1>

      {isTeacher ? (
        <div className={styles.gradesTable}>
          <div className={styles.tableHeader} style={{ backgroundColor: colors.surface0 }}>
            <span>Student</span>
            <span>Przedmiot</span>
            <span>Ocena</span>
            <span>Data</span>
            <span>Akcje</span>
          </div>
          {mockGrades.map(grade => (
            <div key={grade.id} className={styles.tableRow} style={{ borderColor: colors.surface2 }}>
              <div className={styles.cell}>
                <span style={{ color: colors.text }}>{grade.studentName}</span>
                <span style={{ color: colors.subtext1 }}>{grade.studentIndex}</span>
              </div>
              <span style={{ color: colors.text }}>{grade.subject}</span>
              <span style={{ color: colors.blue, fontWeight: 600 }}>{grade.grade.toFixed(1)}</span>
              <span style={{ color: colors.subtext1 }}>{grade.date}</span>
              <button 
                className={styles.editBtn}
                style={{ color: colors.blue }}
                onClick={() => setEditingGrade(grade)}
              >
                Edytuj
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.gradesList}>
          {mockStudentGrades.map((item, idx) => (
            <div key={idx} className={styles.gradeCard} style={{ backgroundColor: colors.mantle }}>
              <div className={styles.gradeInfo}>
                <h3 style={{ color: colors.text }}>{item.subject}</h3>
                <span style={{ color: colors.subtext1 }}>{item.type}</span>
                <span style={{ color: colors.subtext0 }}>{item.date}</span>
              </div>
              <div className={styles.gradeValue} style={{ backgroundColor: colors.surface0 }}>
                <span style={{ color: colors.text }}>{item.grade.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingGrade && (
        <div className={styles.modal} onClick={() => setEditingGrade(null)}>
          <div 
            className={styles.modalContent} 
            style={{ backgroundColor: colors.mantle }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: colors.text }}>Edytuj ocenę</h2>
            <p style={{ color: colors.subtext1 }}>
              {editingGrade.studentName} - {editingGrade.subject}
            </p>
            <div className={styles.gradeInput}>
              <label style={{ color: colors.subtext1 }}>Nowa ocena</label>
              <input 
                type="number" 
                min="2" 
                max="5" 
                step="0.5"
                defaultValue={editingGrade.grade}
                style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2 }}
              />
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                style={{ backgroundColor: colors.surface0, color: colors.text }}
                onClick={() => setEditingGrade(null)}
              >
                Anuluj
              </button>
              <button 
                className={styles.saveBtn}
                style={{ backgroundColor: colors.blue, color: '#fff' }}
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
