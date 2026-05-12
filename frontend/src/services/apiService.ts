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

export const apiService = {
  // Logowanie uzytkownika
  async login(loginInput: string, password: string) {
    console.log('Proba logowania:', loginInput);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: loginInput, password }),
    });
    
    console.log('Odpowiedz status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Blad logowania:', errorData);
      throw new Error(errorData.detail || errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('Logowanie udane:', data);
    return data;
  },

  // Demo logowanie dla różnych ról
  async demoLogin(role: 'student' | 'lecturer' | 'admin') {
    const response = await fetch(`${API_BASE_URL}/auth/demo`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Demo login failed');
    }
    
    return response.json();
  },

  // Wylogowanie użytkownika
  async logout() {
    const token = getToken();
    if (!token) {
      return true; // Brak tokena - nic do roboty
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return response.ok;
  },

  // Pobranie profilu użytkownika
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  // Pobranie kierunków studiów
  async getFields() {
    const response = await fetch(`${API_BASE_URL}/fields`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch fields');
    }
    
    return response.json();
  },

  // Pobranie przedmiotów
  async getSubjects() {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    
    return response.json();
  },

  // Pobranie harmonogramu zajęć
  async getSchedule() {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    
    return response.json();
  },

  // Pobranie ocen
  async getGrades() {
    const response = await fetch(`${API_BASE_URL}/grades`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch grades');
    }
    
    return response.json();
  },

  // Pobranie studentów (dla wykładowców i adminów)
  async getStudents() {
    const response = await fetch(`${API_BASE_URL}/students`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    
    return response.json();
  },

  // Pobranie wykładowców (dla adminów)
  async getLecturers() {
    const response = await fetch(`${API_BASE_URL}/lecturers`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch lecturers');
    }
    
    return response.json();
  },
};
