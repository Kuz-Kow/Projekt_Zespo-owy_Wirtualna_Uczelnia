const API_BASE_URL = '/api';

// Funkcja pomocnicza do pobierania tokena
function getToken(): string | null {
  return localStorage.getItem('token');
}

// Funkcja pomocnicza do tworzenia nagłówków z autoryzacją
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    // Django Token Authentication oczekuje formatu "Token <token>"
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const apiService = {
  // Logowanie uzytkownika
  async login(loginInput: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginInput, password }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Login failed');
    }
    return response.json();
  },

  async demoLogin(role: 'student' | 'lecturer' | 'admin') {
    const response = await fetch(`${API_BASE_URL}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Demo login failed');
    }
    return response.json();
  },

  async logout() {
    const token = getToken();
    if (!token) return true;
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  async getProfile() {
    return apiFetch(`${API_BASE_URL}/auth/profile`);
  },

  // Fields
  async getFields() { return apiFetch(`${API_BASE_URL}/fields`); },
  async createField(data: any) { return apiFetch(`${API_BASE_URL}/fields/`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateField(id: number, data: any) { return apiFetch(`${API_BASE_URL}/fields/${id}/`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteField(id: number) { return apiFetch(`${API_BASE_URL}/fields/${id}/`, { method: 'DELETE' }); },

  // Subjects
  async getSubjects() { return apiFetch(`${API_BASE_URL}/subjects`); },
  async createSubject(data: any) { return apiFetch(`${API_BASE_URL}/subjects/`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateSubject(id: number, data: any) { return apiFetch(`${API_BASE_URL}/subjects/${id}/`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteSubject(id: number) { return apiFetch(`${API_BASE_URL}/subjects/${id}/`, { method: 'DELETE' }); },

  // Students
  async getStudents() { return apiFetch(`${API_BASE_URL}/students`); },
  async createStudent(data: any) { return apiFetch(`${API_BASE_URL}/students/`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateStudent(id: number, data: any) { return apiFetch(`${API_BASE_URL}/students/${id}/`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteStudent(id: number) { return apiFetch(`${API_BASE_URL}/students/${id}/`, { method: 'DELETE' }); },

  // Lecturers
  async getLecturers() { return apiFetch(`${API_BASE_URL}/lecturers`); },
  async createLecturer(data: any) { return apiFetch(`${API_BASE_URL}/lecturers/`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateLecturer(id: number, data: any) { return apiFetch(`${API_BASE_URL}/lecturers/${id}/`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteLecturer(id: number) { return apiFetch(`${API_BASE_URL}/lecturers/${id}/`, { method: 'DELETE' }); },

  // Schedule
  async getSchedule() { return apiFetch(`${API_BASE_URL}/schedules`); },
  async createSchedule(data: any) { return apiFetch(`${API_BASE_URL}/schedules/`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateSchedule(id: number, data: any) { return apiFetch(`${API_BASE_URL}/schedules/${id}/`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteSchedule(id: number) { return apiFetch(`${API_BASE_URL}/schedules/${id}/`, { method: 'DELETE' }); },

  // Grades
  async getGrades() { return apiFetch(`${API_BASE_URL}/grades`); },

  // Users (admin only)
  async getUsers() { return apiFetch(`${API_BASE_URL}/auth/users/`); },
  async createUser(data: any) { return apiFetch(`${API_BASE_URL}/auth/users/`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateUser(id: number, data: any) { return apiFetch(`${API_BASE_URL}/auth/users/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }); },
  async deleteUser(id: number) { return apiFetch(`${API_BASE_URL}/auth/users/${id}/`, { method: 'DELETE' }); },
};
