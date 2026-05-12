import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import styles from './Layout.module.css';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors } = useTheme();

  return (
    <div className={styles.layout} style={{ backgroundColor: colors.base }}>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
