# Wirtualna Uczelnia 🎓

Platforma do zarządzania uczelnią wyższą — system webowy typu full-stack umożliwiający obsługę studentów, wykładowców, przedmiotów, planów zajęć i ocen.

Projekt realizowany w ramach projektów zespołowych. Stan surowy — w trakcie intensywnego rozwoju.

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
- [Uwagi dla deweloperów](#uwagi-dla-deweloperów)

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

| Endpoint                  | Opis                                   |
|---------------------------|----------------------------------------|
| `POST /api/auth/login`    | Logowanie (email + hasło)              |
| `POST /api/auth/demo`     | Logowanie demo (student/lecturer/admin)|
| `GET /api/auth/profile`   | Pobranie profilu zalogowanego użytkownika |
| `POST /api/auth/logout`   | Wylogowanie (usunięcie tokena)         |
| `CRUD /api/fields/`       | Zarządzanie kierunkami studiów         |
| `CRUD /api/subjects/`     | Zarządzanie przedmiotami               |
| `CRUD /api/students/`     | Zarządzanie studentami                 |
| `CRUD /api/lecturers/`    | Zarządzanie wykładowcami               |
| `CRUD /api/schedules/`    | Zarządzanie planem zajęć               |
| `CRUD /api/grades/`       | Zarządzanie ocenami                    |

### Frontend — strony aplikacji

| Ścieżka                         | Opis                                                   |
|---------------------------------|--------------------------------------------------------|
| `/`                             | Ekran logowania + przyciski logowania demo             |
| `/dashboard`                    | Panel główny z powitaniem i szybkimi linkami           |
| `/dashboard/info`               | Dane osobowe użytkownika                               |
| `/dashboard/studies`            | Lista przedmiotów z ocenami                            |
| `/dashboard/schedule`           | Plan zajęć na cały tydzień                             |
| `/dashboard/grades`             | Oceny (student: podgląd, wykładowca: edycja)           |
| `/dashboard/admin/users`        | [Admin] Zarządzanie użytkownikami                      |
| `/dashboard/admin/fields`       | [Admin] Zarządzanie kierunkami studiów                 |
| `/dashboard/admin/subjects`     | [Admin] Zarządzanie przedmiotami                       |
| `/dashboard/admin/students`     | [Admin] Zarządzanie studentami                         |
| `/dashboard/admin/lecturers`    | [Admin] Zarządzanie wykładowcami                       |
| `/dashboard/admin/schedules`    | [Admin] Zarządzanie planem zajęć                       |

### System uprawnień (role)

- **Admin** — pełny CRUD na wszystkich zasobach + panel administracyjny w frontendzie
- **Wykładowca** — może wystawiać i edytować oceny, widzi tylko swoje przedmioty
- **Student** — dostęp tylko do odczytu, widzi tylko swoje dane (oceny, plan)

### Dodatkowo

- Motyw kolorystyczny Catppuccin (jasny `latte` / ciemny `macchiato`) — zapamiętywany w `localStorage`
- Panel administracyjny Django pod `/admin/`
- Baza danych SQLite (generowana przez `migrate` + `seed_data`)

---

## Co planujemy dodać?

- [ ] Połączenie stron frontendu z rzeczywistymi danymi z API (obecnie część danych to mocki)
- [ ] Edycja profilu użytkownika
- [ ] Obsługa sesji egzaminacyjnych (zapisy, terminy, wyniki)
- [ ] System powiadomień (maile, powiadomienia w aplikacji)
- [x] Panel administracyjny w frontendzie (zarządzanie użytkownikami, przedmiotami itp.)
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
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── App.tsx                  # Routing
│       ├── context/                 # AuthContext, ThemeContext
│       ├── services/                # apiService.ts — komunikacja z API
│       ├── components/              # Header, Sidebar, Layout
│       └── pages/                   # LoginPage, DashboardPage, InfoPage,
│                                    # StudiesPage, SchedulePage, GradesPage
│
├── virtual_university/              # Backend (Django REST API)
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                      # Ustawienia Django (settings, urls, wsgi)
│   ├── users/                       # Aplikacja: użytkownicy i autoryzacja
│   └── university/                  # Aplikacja: domeny uczelni (kierunki,
│                                    # przedmioty, studenci, wykładowcy, plan, oceny)
│
├── INTEGRATION_GUIDE.md             # Szczegółowy przewodnik integracji
├── QUICK_START.md                   # Szybki start w pigułce
└── README.md                        # Ten plik
```

---

## Uruchomienie — krok po kroku

### Wymagania wstępne

- **Python** 3.10+ (zalecane 3.14)
- **Node.js** 18+ (zalecane najnowsze LTS)
- **npm** (do zarządzania paczkami frontendu)
- **Git** (do klonowania repozytorium)

---

### Backend (Django REST API)

Instrukcja dla **Linux (w tym Arch), macOS i Windows**.

#### 1. Sklonuj repozytorium

```bash
git clone <adres-repozytorium>
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

| Rola        | Email              | Hasło          |
|-------------|--------------------|----------------|
| Student     | student@demo.com   | demo123        |
| Wykładowca  | lecturer@demo.com  | demo123        |
| Admin       | admin@demo.com     | demo123        |

Dodatkowe konta: `admin/admin123`, `wykladowca/lecturer123`, `student/student123`, `student2/student123`.

Możesz też skorzystać z przycisków **Zaloguj jako Student / Wykładowca / Admin** na stronie logowania.

---

## Uwagi dla deweloperów

- **Backend** i **frontend** muszą być uruchomione **jednocześnie** (dwa osobne terminale).
- Na razie **nie ma pliku `.env`** — klucz `SECRET_KEY` w `settings.py` to placeholder. Przed wdrożeniem produkcyjnym należy go zmienić.
- **Baza danych SQLite** (`db.sqlite3`) nie jest dołączona do repozytorium. Po pierwszym uruchomieniu wykonaj `migrate`, a następnie `seed_data`, aby wypełnić bazę przykładowymi danymi.
- `CORS_ALLOW_ALL_ORIGINS = True` — tylko na czas rozwoju, **nie wrzucać na produkcję**.
- W razie problemów z uruchomieniem sprawdź plik `INTEGRATION_GUIDE.md` (szczegółowy przewodnik) lub `QUICK_START.md` (lista kontrolna).
