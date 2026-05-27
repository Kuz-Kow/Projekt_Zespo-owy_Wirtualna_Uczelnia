# Wirtualna Uczelnia 🎓

Platforma do zarządzania uczelnią wyższą — system webowy typu full-stack umożliwiający obsługę studentów, wykładowców, przedmiotów, planów zajęć, ocen i materiałów dydaktycznych.

Projekt realizowany w ramach projektów zespołowych.

---

## Spis treści

- [Stos technologiczny](#stos-technologiczny)
- [Co już działa?](#co-już-działa)
- [Co planujemy dodać?](#co-planujemy-dodać)
- [Struktura projektu](#struktura-projektu)
- [Uruchomienie — krok po kroku](#uruchomienie--krok-po-kroku)
  - [Wymagania wstępne](#wymagania-wstępne)
  - [Backend (Django REST API)](#backend-django-rest-api)
  - [Frontend (React + Vite)](#frontend-react--vite)
  - [Dostep do aplikacji](#dostep-do-aplikacji)
- [Konta demonstracyjne](#konta-demonstracyjne)

---

## Stos technologiczny

| Warstwa     | Technologia                                                   |
|-------------|---------------------------------------------------------------|
| Backend     | Python 3.14+, Django 4.2, Django REST Framework 3.14          |
| Frontend    | React 19.2, TypeScript 6.0, Vite 8.0                         |
| Baza danych | SQLite (plik `db.sqlite3`)                                    |
| Auth        | TokenAuthentication (DRF)                                     |

---

## Co już działa?

### Backend — REST API (wszystkie endpointy są w pełni funkcjonalne)

| Endpoint                          | Opis                                                   |
|-----------------------------------|--------------------------------------------------------|
| `POST /api/auth/login`            | Logowanie (email lub nazwa użytkownika + hasło)         |
| `POST /api/auth/demo`             | Logowanie demo (student/lecturer/admin)                |
| `GET /api/auth/profile`           | Pobranie profilu zalogowanego użytkownika              |
| `POST /api/auth/logout`           | Wylogowanie (usunięcie tokena)                         |
| `CRUD /api/auth/users/`           | [Admin] Zarządzanie użytkownikami                      |
| `CRUD /api/fields/`               | Zarządzanie kierunkami studiów                         |
| `CRUD /api/subjects/`             | Zarządzanie przedmiotami                               |
| `CRUD /api/students/`             | Zarządzanie studentami                                 |
| `GET /api/students/my_students`   | [Wykładowca] Lista studentów zapisanych na jego przedmioty |
| `CRUD /api/lecturers/`            | Zarządzanie wykładowcami                               |
| `CRUD /api/schedules/`            | Zarządzanie planem zajęć                               |
| `CRUD /api/grades/`               | Zarządzanie ocenami                                    |
| `CRUD /api/materials/`            | Zarządzanie materiałami dydaktycznymi                  |

### Frontend — strony aplikacji

| Ścieżka                         | Opis                                                                   |
|---------------------------------|------------------------------------------------------------------------|
| `/`                             | Ekran logowania + przyciski logowania demo                             |
| `/dashboard`                    | Panel główny (admin: panel admina, wykładowca/student: dashboard)      |
| `/dashboard/info`               | Dane osobowe użytkownika                                               |
| `/dashboard/studies`            | [Student] Lista przedmiotów z ocenami                                  |
| `/dashboard/schedule`           | Plan zajęć w formie siatki tygodniowej (07:00–20:30)                   |
| `/dashboard/grades`             | Student: podgląd ocen; Wykładowca: wystawianie ocen                    |
| `/dashboard/materials`          | Wykładowca: dodawanie/usuwanie materiałów; Student: podgląd            |
| `/dashboard/admin/dashboard`    | [Admin] Strona główna panelu z opisem funkcji                          |
| `/dashboard/admin/users`        | [Admin] Zarządzanie użytkownikami                                      |
| `/dashboard/admin/fields`       | [Admin] Zarządzanie kierunkami studiów                                 |
| `/dashboard/admin/subjects`     | [Admin] Zarządzanie przedmiotami                                       |
| `/dashboard/admin/students`     | [Admin] Zarządzanie studentami                                         |
| `/dashboard/admin/lecturers`    | [Admin] Zarządzanie wykładowcami                                       |
| `/dashboard/admin/schedules`    | [Admin] Zarządzanie planem zajęć                                       |

### System uprawnień (role)

- **Admin** — pełny CRUD na wszystkich zasobach + panel administracyjny w frontendzie. Nie widzi planu zajęć ani ocen w zwykłym widoku.
- **Wykładowca** — może wystawiać i usuwać oceny, dodawać/usuwać materiały, widzi tylko swoje przedmioty i plan. Menu bez "Studia".
- **Student** — dostęp tylko do odczytu, widzi tylko swoje dane (oceny, plan, materiały).

### Dodatkowo

- Panel administracyjny Django pod `/admin/`
- Automatyczne tworzenie profili Student/Lecturer przy zakładaniu użytkownika
- Motyw kolorystyczny Catppuccin (jasny `latte` / ciemny `macchiato`) — zapamiętywany w `localStorage`
- Baza danych SQLite (generowana przez `migrate` + `seed_data`)
- Siódemkowy plan zajęć z kolorami przedmiotów i widokiem mobilnym
- Sidebar dynamicznie dostosowany do roli użytkownika

---

## Co planujemy dodać?

- [ ] Obsługa sesji egzaminacyjnych (zapisy, terminy, wyniki)
- [ ] System powiadomień (maile, powiadomienia w aplikacji)
- [ ] Testy automatyczne (backend + frontend)
- [ ] Konfiguracja przez zmienne środowiskowe (`.env`)
- [ ] Docker / docker-compose do łatwego uruchomienia
- [ ] Konfiguracja produkcyjna (DEBUG=False, bezpieczny SECRET_KEY, CORS na konkretne domeny)
- [ ] Dokumentacja API (Swagger/OpenAPI)

---

## Struktura projektu

```
Projekt_Zespo-owy_Wirtualna_Uczelnia/
├── frontend/                        # Aplikacja frontendowa (React + Vite)
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── main.tsx                 # Entry point
│   │   ├── App.tsx                  # Routing
│   │   ├── index.css                # Style globalne
│   │   ├── assets/                  # Obrazy (hero.png, svg)
│   │   ├── context/                 # AuthContext, ThemeContext
│   │   ├── services/                # apiService.ts — komunikacja z API
│   │   ├── components/              # Header, Sidebar, Layout
│   │   └── pages/                   # LoginPage, DashboardPage, InfoPage,
│   │                                # StudiesPage, SchedulePage, GradesPage,
│   │                                # MaterialsPage, AdminDashboardPage,
│   │                                # admin/ (Users, Fields, Subjects,
│   │                                #   Students, Lecturers, Schedules)
│   └── .gitignore
│
├── virtual_university/              # Backend (Django REST API)
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env / .env.example          # Zmienne środowiskowe
│   ├── config/                      # Ustawienia Django (settings, urls, wsgi)
│   ├── users/                       # Aplikacja: użytkownicy i autoryzacja
│   │   └── management/commands/     # seed_data.py — dane demonstracyjne
│   └── university/                  # Aplikacja: domeny uczelni (kierunki,
│                                    # przedmioty, studenci, wykładowcy,
│                                    # plan, oceny, materiały)
│
├── .gitignore
└── README.md                        # Ten plik
```

---

## Uruchomienie — krok po kroku

### Wymagania wstępne

- **Python** 3.10+ (zalecane 3.14)
- **Node.js** 18+ (zalecane najnowsze LTS)
- **npm** (do zarządzania paczkami frontendu)
- **unzip** (do rozpakowania archiwum)

---

### Backend (Django REST API)

Instrukcja dla **Linux (w tym Arch), macOS i Windows**.

#### 1. Pobierz i rozpakuj archiwum

Pobierz plik `Projekt_zespolowy_Lab3_zesp2_2026.zip` i rozpakuj go:

```bash
unzip Projekt_zespolowy_Lab3_zesp2_2026.zip
cd Projekt_Zespo-owy_Wirtualna_Uczelnia
```

#### 2. Utwórz i aktywuj wirtualne środowisko

**Linux / macOS (bash/zsh):**
```bash
cd virtual_university
python3 -m venv venv
source venv/bin/activate
```

**Windows (PowerShell):**
```powershell
cd virtual_university
python -m venv venv
venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
cd virtual_university
python -m venv venv
venv\Scripts\activate.bat
```

> **Uwaga dla użytkowników Arch Linux:** Jeśli `python` nie jest domyślnie dostępny, użyj `python3`. Na Archu może być też potrzebne `python python-pip python-virtualenv` z pacmana.

#### 3. Zainstaluj zależności

```bash
pip install -r requirements.txt
```

#### 4. Wykonaj migracje bazy danych

```bash
python manage.py migrate
```

> Jeśli używasz Windows i występują błędy związane z kodowaniem UTF-8, ustaw zmienną środowiskową:
> ```cmd
> set PYTHONUTF8=1
> python manage.py migrate
> ```

#### 5. (Opcjonalnie) Załaduj dane demonstracyjne

```bash
python manage.py seed_data
```

#### 6. Uruchom serwer developerski

```bash
python manage.py runserver 8000
```

Backend będzie dostępny pod adresem `http://localhost:8000`.

---

### Frontend (React + Vite)

#### 1. Przejdź do katalogu frontendu

```bash
cd frontend
```

#### 2. Zainstaluj zależności

```bash
npm install
```

#### 3. Uruchom serwer deweloperski

```bash
npm run dev
```

Frontend będzie dostępny pod adresem `http://localhost:5173`.

> Aplikacja frontendowa automatycznie przekierowuje zapytania `/api/*` na `localhost:8000` dzięki konfiguracji proxy w Vite (plik `vite.config.ts`).

---

### Dostęp do aplikacji

| Adres                   | Opis                       |
|-------------------------|----------------------------|
| `http://localhost:5173` | Aplikacja frontendowa      |
| `http://localhost:8000/api/...` | API backendowe  |
| `http://localhost:8000/admin/`  | Panel Django Admin |

---

## Konta demonstracyjne

Po uruchomieniu `seed_data` dostępne są następujące konta:

| Rola        | Nazwa użytkownika | Hasło          |
|-------------|-------------------|----------------|
| Admin       | admin             | admin123       |
| Wykładowca  | wykladowca        | lecturer123    |
| Student     | student           | student123     |

Możesz też skorzystać z przycisków **Zaloguj jako Student / Wykładowca / Admin** na stronie logowania (konta: student_demo / lecturer_demo / admin_demo, hasło: demo123).

