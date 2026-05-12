# Wirtualna Uczelnia - Backend Setup & Integration

## Backend (Django)

### Installation

1. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

2. **Activate virtual environment**
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. **Install dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers python-dotenv
   ```

4. **Create Django project structure**
   ```bash
   django-admin startproject config .
   python manage.py startapp users
   python manage.py startapp university
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (admin)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run Django server**
   ```bash
   python manage.py runserver 8000
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/demo` - Demo login (student, lecturer, admin)
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout

#### University
- `GET /api/fields` - Get all fields of study
- `GET /api/subjects` - Get all subjects
- `GET /api/students` - Get all students
- `GET /api/lecturers` - Get all lecturers
- `GET /api/schedules` - Get class schedule
- `GET /api/grades` - Get grades

## Frontend (React + TypeScript + Vite)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` and proxy API requests to `http://localhost:8000`

### Login Features

- **Regular Login**: Enter email and password
- **Demo Login**: Quick access with predefined roles:
  - Student (student@demo.com)
  - Lecturer (lecturer@demo.com)
  - Admin (admin@demo.com)

## Running Both Together

1. **Terminal 1 - Backend**
   ```bash
   cd virtual_university
   venv\Scripts\activate  # Windows
   python manage.py runserver 8000
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the app**
   - Frontend: `http://localhost:5173`
   - Admin: `http://localhost:8000/admin`

## Key Files

### Backend
- `config/settings.py` - Django configuration with CORS
- `config/urls.py` - Main URL routing
- `users/views.py` - Authentication endpoints
- `users/serializers.py` - Data serialization
- `university/models.py` - Data models
- `university/views.py` - CRUD operations

### Frontend
- `src/services/apiService.ts` - API client
- `src/context/AuthContext.tsx` - Authentication state management
- `src/pages/LoginPage.tsx` - Login interface
- `vite.config.ts` - Proxy configuration

## Architecture

The frontend and backend communicate via REST API:
- Frontend makes requests to `/api` endpoints
- Vite proxy redirects these to backend (`http://localhost:8000`)
- Authentication uses token-based system
- User data stored in localStorage
