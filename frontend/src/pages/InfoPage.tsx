import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './InfoPage.module.css';

export function InfoPage() {
  const { user } = useAuth();
  const { colors } = useTheme();

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
          {user?.role === 'teacher' && (user?.academicTitle || 'Wykładowca')}
          {user?.role === 'admin' && 'Administrator'}
        </p>
      </div>

      <div className={styles.details} style={{ backgroundColor: colors.mantle }}>
        <div className={styles.field}>
          <span className={styles.label} style={{ color: colors.subtext1 }}>Email</span>
          <span className={styles.value} style={{ color: colors.text }}>{user?.email}</span>
        </div>
        
        {user?.role === 'student' && user?.indexNumber && (
          <div className={styles.field}>
            <span className={styles.label} style={{ color: colors.subtext1 }}>Numer indeksu</span>
            <span className={styles.value} style={{ color: colors.text }}>{user.indexNumber}</span>
          </div>
        )}

        <div className={styles.field}>
          <span className={styles.label} style={{ color: colors.subtext1 }}>Typ konta</span>
          <span className={styles.value} style={{ color: colors.text }}>
            {user?.role === 'student' && 'Konto studenta'}
            {user?.role === 'teacher' && 'Konto wykładowcy'}
            {user?.role === 'admin' && 'Konto administratora'}
          </span>
        </div>
      </div>
    </div>
  );
}
