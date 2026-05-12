import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { colors, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Nieprawidłowy email lub hasło');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    } catch {
      setError('Błąd połączenia z serwerem');
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.container} style={{ backgroundColor: colors.base }}>
      <button 
        className={styles.themeToggle} 
        onClick={toggleTheme}
        style={{ color: colors.text }}
      >
        {theme === 'latte' ? '🌙' : '☀️'}
      </button>

      <div className={styles.loginBox} style={{ backgroundColor: colors.mantle }}>
        <div className={styles.logo}>
          <div className={styles.logoIcon} style={{ backgroundColor: colors.blue }}>
            <span style={{ color: colors.crust }}>W</span>
          </div>
          <h1 style={{ color: colors.text }}>Wirtualna Uczelnia</h1>
          <p style={{ color: colors.subtext1 }}>Platforma edukacyjna</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label style={{ color: colors.subtext1 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan.kowalski@uczelnia.pl"
              style={{ 
                backgroundColor: colors.surface0, 
                color: colors.text,
                borderColor: colors.surface2
              }}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label style={{ color: colors.subtext1 }}>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                backgroundColor: colors.surface0, 
                color: colors.text,
                borderColor: colors.surface2
              }}
              required
            />
          </div>

          {error && <p className={styles.error} style={{ color: colors.red }}>{error}</p>}

          <button 
            type="submit" 
            className={styles.loginBtn}
            style={{ backgroundColor: colors.blue }}
            disabled={isLoading}
          >
            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className={styles.divider}>
          <span style={{ color: colors.subtext0 }}>lub</span>
        </div>

        <div className={styles.demoSection}>
          <p style={{ color: colors.subtext1 }}>Demo:</p>
          <div className={styles.demoButtons}>
            <button 
              className={styles.demoBtn}
              style={{ backgroundColor: colors.surface0, color: colors.text }}
              onClick={() => handleDemoLogin('student')}
            >
              Student
            </button>
            <button 
              className={styles.demoBtn}
              style={{ backgroundColor: colors.surface0, color: colors.text }}
              onClick={() => handleDemoLogin('teacher')}
            >
              Wykładowca
            </button>
            <button 
              className={styles.demoBtn}
              style={{ backgroundColor: colors.surface0, color: colors.text }}
              onClick={() => handleDemoLogin('admin')}
            >
              Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
