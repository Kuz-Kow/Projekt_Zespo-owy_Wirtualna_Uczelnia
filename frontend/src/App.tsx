import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { InfoPage } from './pages/InfoPage';
import { StudiesPage } from './pages/StudiesPage';
import { SchedulePage } from './pages/SchedulePage';
import { GradesPage } from './pages/GradesPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminFieldsPage } from './pages/admin/AdminFieldsPage';
import { AdminSubjectsPage } from './pages/admin/AdminSubjectsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminLecturersPage } from './pages/admin/AdminLecturersPage';
import { AdminSchedulesPage } from './pages/admin/AdminSchedulesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function DashboardOrAdmin() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboardPage /> : <DashboardPage />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOrAdmin />} />
              <Route path="info" element={<InfoPage />} />
              <Route path="studies" element={<StudiesPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="grades" element={<GradesPage />} />
              <Route path="materials" element={<MaterialsPage />} />
              <Route path="admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="admin/fields" element={<AdminRoute><AdminFieldsPage /></AdminRoute>} />
              <Route path="admin/subjects" element={<AdminRoute><AdminSubjectsPage /></AdminRoute>} />
              <Route path="admin/students" element={<AdminRoute><AdminStudentsPage /></AdminRoute>} />
              <Route path="admin/lecturers" element={<AdminRoute><AdminLecturersPage /></AdminRoute>} />
              <Route path="admin/schedules" element={<AdminRoute><AdminSchedulesPage /></AdminRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
