import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import styles from './InfoPage.module.css';

interface StudentProfile {
  id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  semester: number;
  year: number;
  field_of_study_name: string;
  subjects_names: string[];
}

interface LecturerProfile {
  id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  academic_title: string;
  subjects_names: string[];
}

export function InfoPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [lecturerProfile, setLecturerProfile] = useState<LecturerProfile | null>(null);

  useEffect(() => {
    if (user?.role === 'student' || user?.role === 'lecturer') {
      if (user.role === 'student') {
        apiService.getStudents().then(data => {
          const arr = Array.isArray(data) ? data : [];
          if (arr.length > 0) setStudentProfile(arr[0]);
        }).catch(() => {});
      } else {
        apiService.getLecturers().then(data => {
          const arr = Array.isArray(data) ? data : [];
          if (arr.length > 0) setLecturerProfile(arr[0]);
        }).catch(() => {});
      }
    }
  }, [user]);


  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={{ color: colors.text }}>Informacje osobiste</h1>
      
      <div className={styles.card} style={{ backgroundColor: colors.mantle }}>
        <div className={styles.avatar} style={{ backgroundColor: colors.blue }}>
          {user?.firstName[0]}{user?.lastName[0]}
        </div>
        <h2 className={styles.name} style={{ color: colors.text }}>
          {user?.firstName} {user?.lastName}
        </h2>
        <p className={styles.role} style={{ color: colors.subtext1 }}>
          {user?.role === 'student' && 'Student'}
          {user?.role === 'lecturer' && (user?.academicTitle || 'Wykładowca')}
          {user?.role === 'admin' && 'Administrator'}
        </p>
      </div>

      <div className={styles.details} style={{ backgroundColor: colors.mantle }}>
        <div className={styles.field} style={{ borderColor: colors.surface2 }}>
          <span className={styles.label} style={{ color: colors.subtext1 }}>Email</span>
          <span className={styles.value} style={{ color: colors.text }}>{user?.email}</span>
        </div>
        
        {user?.role === 'student' && user?.indexNumber && (
          <div className={styles.field} style={{ borderColor: colors.surface2 }}>
            <span className={styles.label} style={{ color: colors.subtext1 }}>Numer indeksu</span>
            <span className={styles.value} style={{ color: colors.text }}>{user.indexNumber}</span>
          </div>
        )}

        {user?.role === 'lecturer' && user?.academicTitle && (
          <div className={styles.field} style={{ borderColor: colors.surface2 }}>
            <span className={styles.label} style={{ color: colors.subtext1 }}>Tytuł naukowy</span>
            <span className={styles.value} style={{ color: colors.text }}>{user.academicTitle}</span>
          </div>
        )}

        {studentProfile && (
          <>
            <div className={styles.field} style={{ borderColor: colors.surface2 }}>
              <span className={styles.label} style={{ color: colors.subtext1 }}>Kierunek</span>
              <span className={styles.value} style={{ color: colors.text }}>{studentProfile.field_of_study_name}</span>
            </div>
            <div className={styles.field} style={{ borderColor: colors.surface2 }}>
              <span className={styles.label} style={{ color: colors.subtext1 }}>Rok / Semestr</span>
              <span className={styles.value} style={{ color: colors.text }}>{studentProfile.year} / {studentProfile.semester}</span>
            </div>
            <div className={styles.field} style={{ borderColor: colors.surface2 }}>
              <span className={styles.label} style={{ color: colors.subtext1 }}>Przedmioty</span>
              <span className={styles.value} style={{ color: colors.text }}>{studentProfile.subjects_names.length}</span>
            </div>
          </>
        )}

        {lecturerProfile && (
          <>
            <div className={styles.field} style={{ borderColor: colors.surface2 }}>
              <span className={styles.label} style={{ color: colors.subtext1 }}>Prowadzone przedmioty</span>
              <span className={styles.value} style={{ color: colors.text }}>{lecturerProfile.subjects_names.length}</span>
            </div>
            {lecturerProfile.subjects_names.length > 0 && (
              <div className={styles.field} style={{ borderColor: colors.surface2, flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                <span className={styles.label} style={{ color: colors.subtext1 }}>Lista przedmiotów</span>
                <span className={styles.value} style={{ color: colors.text, fontSize: '0.85rem' }}>
                  {lecturerProfile.subjects_names.join(', ')}
                </span>
              </div>
            )}
          </>
        )}

        <div className={styles.field} style={{ borderColor: colors.surface2 }}>
          <span className={styles.label} style={{ color: colors.subtext1 }}>Typ konta</span>
          <span className={styles.value} style={{ color: colors.text }}>
            {user?.role === 'student' && 'Konto studenta'}
            {user?.role === 'lecturer' && 'Konto wykładowcy'}
            {user?.role === 'admin' && 'Konto administratora'}
          </span>
        </div>
      </div>
    </div>
  );
}
