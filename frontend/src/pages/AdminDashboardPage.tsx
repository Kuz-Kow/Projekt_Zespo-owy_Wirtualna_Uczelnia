import { useTheme } from '../context/ThemeContext';
import styles from './DashboardPage.module.css';

export function AdminDashboardPage() {
  const { colors } = useTheme();

  return (
    <div className={styles.container}>
      <div className={styles.welcome} style={{ backgroundColor: colors.mantle }}>
        <div>
          <h1 style={{ color: colors.text, margin: 0, fontSize: '1.5rem' }}>Panel administracyjny</h1>
          <p style={{ color: colors.subtext1, margin: '0.25rem 0 0' }}>
            Zarządzaj uczelnią — użytkownicy, kierunki, przedmioty, rozkład zajęć
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ backgroundColor: colors.mantle, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ color: colors.blue, margin: '0 0 0.75rem', fontSize: '1.1rem' }}>👥 Użytkownicy</h3>
          <p style={{ color: colors.subtext1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Twórz i zarządzaj kontami studentów, wykładowców i administratorów. Nadawaj role, ustawiaj hasła.
          </p>
        </div>

        <div style={{ backgroundColor: colors.mantle, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ color: colors.green, margin: '0 0 0.75rem', fontSize: '1.1rem' }}>🏛️ Kierunki</h3>
          <p style={{ color: colors.subtext1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Dodawaj kierunki studiów i określaj liczbę semestrów dla każdego z nich.
          </p>
        </div>

        <div style={{ backgroundColor: colors.mantle, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ color: colors.peach, margin: '0 0 0.75rem', fontSize: '1.1rem' }}>📖 Przedmioty</h3>
          <p style={{ color: colors.subtext1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Twórz przedmioty, przypisuj je do kierunku i semestru. Dodawaj wykładowców prowadzących każdy przedmiot.
          </p>
        </div>

        <div style={{ backgroundColor: colors.mantle, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ color: colors.mauve, margin: '0 0 0.75rem', fontSize: '1.1rem' }}>🎓 Studenci</h3>
          <p style={{ color: colors.subtext1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Przypisuj studentów do kierunków i semestrów. Przedmioty dobierają się automatycznie.
          </p>
        </div>

        <div style={{ backgroundColor: colors.mantle, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ color: colors.teal, margin: '0 0 0.75rem', fontSize: '1.1rem' }}>👨‍🏫 Wykładowcy</h3>
          <p style={{ color: colors.subtext1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Twórz profile wykładowców i przypisuj ich do przedmiotów.
          </p>
        </div>

        <div style={{ backgroundColor: colors.mantle, borderRadius: 12, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ color: colors.red, margin: '0 0 0.75rem', fontSize: '1.1rem' }}>📅 Plan zajęć</h3>
          <p style={{ color: colors.subtext1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
            Układaj rozkład zajęć dla każdego kierunku i semestru. Wybierz przedmiot, wykładowcę, dzień, godzinę i salę.
          </p>
        </div>
      </div>
    </div>
  );
}