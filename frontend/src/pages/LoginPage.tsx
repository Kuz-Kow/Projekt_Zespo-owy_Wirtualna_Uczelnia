import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { colors, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(loginInput, password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Blad logowania';
      console.error('Blad logowania:', errorMessage);
      setError(errorMessage);
    }
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
            <label style={{ color: colors.subtext1 }}>Login lub email</label>
            <input
              type="text"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
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
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
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
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                style={{ color: colors.subtext1 }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <p className={styles.error} style={{ color: colors.red }}>{error}</p>}

          <button 
            type="submit" 
            className={styles.loginBtn}
            style={{ backgroundColor: colors.blue }}
          >
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
}
