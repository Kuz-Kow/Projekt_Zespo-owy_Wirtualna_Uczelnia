import { useTheme } from '../context/ThemeContext';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { colors, toggleTheme, theme } = useTheme();

  return (
    <header className={styles.header} style={{ backgroundColor: colors.mantle }}>
      <button 
        className={styles.menuBtn}
        onClick={onMenuClick}
        style={{ color: colors.text }}
      >
        <span>☰</span>
      </button>

      <h1 className={styles.title} style={{ color: colors.text }}>
        Wirtualna Uczelnia
      </h1>

      <button 
        className={styles.themeBtn}
        onClick={toggleTheme}
        style={{ color: colors.text }}
        title={theme === 'latte' ? 'Przełącz na tryb ciemny' : 'Przełącz na tryb jasny'}
      >
        {theme === 'latte' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
