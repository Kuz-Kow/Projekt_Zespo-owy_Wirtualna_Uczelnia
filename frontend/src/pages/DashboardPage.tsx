import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const quickLinks = [
    { path: '/dashboard/schedule', label: 'Plan zajęć', icon: '📅', color: colors.blue },
    { path: '/dashboard/studies', label: 'Studia', icon: '📚', color: colors.green },
    { path: '/dashboard/grades', label: 'Oceny', icon: '📝', color: colors.peach },
    { path: '/dashboard/info', label: 'Informacje', icon: '👤', color: colors.mauve },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.welcome} style={{ backgroundColor: colors.mantle }}>
        <div className={styles.welcomeText}>
          <h1 style={{ color: colors.text }}>
            Witaj, {user?.firstName}!
          </h1>
          <p style={{ color: colors.subtext1 }}>
            {user?.role === 'student' && 'Miło Cię widzieć. Sprawdź swoje zajęcia i oceny.'}
            {user?.role === 'teacher' && 'Miło Cię widzieć. Zarządzaj swoimi zajęciami i ocenami studentów.'}
            {user?.role === 'admin' && 'Miło Cię widzieć. Zarządzaj platformą uczelni.'}
          </p>
        </div>
        <div className={styles.welcomeIcon} style={{ backgroundColor: colors.blue }}>
          🎓
        </div>
      </div>

      <div className={styles.quickLinks}>
        {quickLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path}
            className={styles.quickLink}
            style={{ backgroundColor: colors.mantle }}
          >
            <div className={styles.quickLinkIcon} style={{ backgroundColor: link.color }}>
              {link.icon}
            </div>
            <span style={{ color: colors.text }}>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className={styles.cards}>
        <div className={styles.card} style={{ backgroundColor: colors.mantle }}>
          <h3 style={{ color: colors.text }}>Nadchodzące zajęcia</h3>
          <div className={styles.nextLesson}>
            <span style={{ color: colors.blue }}>10:00 - 11:30</span>
            <span style={{ color: colors.text }}>Programowanie obiektowe</span>
            <span style={{ color: colors.subtext1 }}>Sala B-203</span>
          </div>
        </div>

        <div className={styles.card} style={{ backgroundColor: colors.mantle }}>
          <h3 style={{ color: colors.text }}>Ostatnie oceny</h3>
          <div className={styles.lastGrades}>
            <div className={styles.gradeItem}>
              <span style={{ color: colors.text }}>Matematyka dyskretna</span>
              <span style={{ color: colors.green }}>4.5</span>
            </div>
            <div className={styles.gradeItem}>
              <span style={{ color: colors.text }}>Programowanie obiektowe</span>
              <span style={{ color: colors.green }}>5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
