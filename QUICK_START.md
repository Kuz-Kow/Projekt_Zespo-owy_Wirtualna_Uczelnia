# 🚀 Quick Start - Frontend + Backend Integration

## ✅ Setup Checklist

### Backend Setup
- [ ] Navigate to `virtual_university` folder
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate venv: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser (optional): `python manage.py createsuperuser`
- [ ] Start server: `python manage.py runserver 8000`

### Frontend Setup
- [ ] Navigate to `frontend` folder
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`

### Access Points
- **Frontend App:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | demo123 |
| Lecturer | lecturer@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

Just click the demo buttons on login page - no need to enter credentials!

## 📝 API Structure

```
/api/
├── auth/
│   ├── login (POST)
│   ├── demo (POST)
│   ├── profile (GET)
│   └── logout (POST)
├── fields/ (CRUD)
├── subjects/ (CRUD)
├── students/ (CRUD)
├── lecturers/ (CRUD)
├── schedules/ (CRUD)
└── grades/ (CRUD)
```

## 🔧 Configuration Files

**Backend:**
- `config/settings.py` - Django config with CORS
- `config/urls.py` - Main URL routing
- `users/views.py` - Auth endpoints
- `university/models.py` - Data models

**Frontend:**
- `vite.config.ts` - API proxy setup
- `src/services/apiService.ts` - API client
- `src/context/AuthContext.tsx` - Auth state

## 🐛 Troubleshooting

**Port 8000 already in use:**
```bash
python manage.py runserver 8001
# Then update vite.config.ts proxy target
```

**Frontend can't connect to backend:**
- Check both servers are running
- Verify ports: Frontend 5173, Backend 8000
- Check browser console for CORS errors

**Database errors:**
```bash
python manage.py migrate --run-syncdb
```

**Clear everything and restart:**
```bash
# Backend
rm db.sqlite3
python manage.py migrate
python manage.py runserver 8000

# Frontend
npm run dev
```
