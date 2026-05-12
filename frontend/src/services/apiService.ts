const API_BASE_URL = '/api';

export const apiService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
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
      throw new Error('Demo login failed');
    }
    
    return response.json();
  },

  async logout() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });
    
    return response.ok;
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  async getFields() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/fields`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch fields');
    }
    
    return response.json();
  },

  async getSubjects() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    
    return response.json();
  },

  async getSchedule() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    
    return response.json();
  },

  async getGrades() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/grades`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch grades');
    }
    
    return response.json();
  },
};
