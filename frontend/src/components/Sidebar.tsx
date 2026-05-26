import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const adminItems = [
  { path: '/dashboard/admin/users', label: 'Użytkownicy', icon: '👥' },
  { path: '/dashboard/admin/fields', label: 'Kierunki', icon: '🏛️' },
  { path: '/dashboard/admin/subjects', label: 'Przedmioty', icon: '📖' },
  { path: '/dashboard/admin/students', label: 'Studenci', icon: '🎓' },
  { path: '/dashboard/admin/lecturers', label: 'Wykładowcy', icon: '👨‍🏫' },
  { path: '/dashboard/admin/schedules', label: 'Plan zajęć', icon: '📅' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <aside 
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
        style={{ backgroundColor: colors.mantle }}
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon} style={{ backgroundColor: colors.blue }}>
              <span style={{ color: colors.crust }}>W</span>
            </div>
            <span style={{ color: colors.text }}>Wirtualna Uczelnia</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} style={{ color: colors.text }}>
            ✕
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatar} style={{ backgroundColor: colors.blue }}>
            {user?.firstName[0]}{user?.lastName[0]}
          </div>
          <div className={styles.userDetails}>
            <span style={{ color: colors.text }}>{user?.firstName} {user?.lastName}</span>
            <span style={{ color: colors.subtext1 }}>
              {user?.role === 'student' && 'Student'}
              {user?.role === 'lecturer' && (user?.academicTitle || 'Wykładowca')}
              {user?.role === 'admin' && 'Administrator'}
            </span>
          </div>
        </div>

        <nav className={styles.nav}>
          {user?.role === 'student' && (
            <>
              <NavLink to="/dashboard" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>🏠</span><span>Strona główna</span>
              </NavLink>
              <NavLink to="/dashboard/info" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>👤</span><span>Informacje osobiste</span>
              </NavLink>
              <NavLink to="/dashboard/studies" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>📚</span><span>Studia</span>
              </NavLink>
              <NavLink to="/dashboard/schedule" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>📅</span><span>Plan zajęć</span>
              </NavLink>
              <NavLink to="/dashboard/grades" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>📝</span><span>Oceny</span>
              </NavLink>
              <NavLink to="/dashboard/materials" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>📄</span><span>Materiały</span>
              </NavLink>
            </>
          )}

          {user?.role === 'lecturer' && (
            <>
              <NavLink to="/dashboard" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>🏠</span><span>Strona główna</span>
              </NavLink>
              <NavLink to="/dashboard/info" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>👤</span><span>Informacje osobiste</span>
              </NavLink>
              <NavLink to="/dashboard/schedule" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>📅</span><span>Plan zajęć</span>
              </NavLink>
              <NavLink to="/dashboard/grades" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>📝</span><span>Wystawianie ocen</span>
              </NavLink>
              <NavLink to="/dashboard/materials" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`} style={({ isActive }) => ({ backgroundColor: isActive ? colors.surface0 : 'transparent', color: isActive ? colors.blue : colors.text })} onClick={onClose}>
                <span className={styles.navIcon}>📄</span><span>Materiały</span>
              </NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className={styles.navSection} style={{ color: colors.subtext0 }}>Panel administracyjny</div>
              {adminItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? colors.surface0 : 'transparent',
                    color: isActive ? colors.blue : colors.text,
                  })}
                  onClick={onClose}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className={styles.footer}>
          <button 
            className={styles.logoutBtn}
            onClick={handleLogout}
            style={{ color: colors.red }}
          >
            <span>🚪</span>
            <span>Wyloguj się</span>
          </button>
        </div>
      </aside>
    </>
  );
}