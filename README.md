# MedAxis — B2B Healthcare Dashboard

A production-ready B2B Healthcare UI built as a frontend engineering assignment for an SDE 1 role. The application simulates a real hospital operations dashboard for clinical staff, featuring authentication, real-time-style notifications, rich data visualisation, and a fully responsive patient management interface.

**Live Demo:** [med-axis-b2b-healthcare-ui.vercel.app](https://med-axis-b2b-healthcare-ui.vercel.app)  
**Repository:** [github.com/DeepthiM15/medAxis_b2b_healthcare_ui](https://github.com/DeepthiM15/medAxis_b2b_healthcare_ui)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| State Management | Zustand (with `persist` middleware) |
| Authentication | Firebase Auth (Email/Password) |
| Notifications | Service Worker + Web Notifications API |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Features

### Authentication
- Firebase Email/Password sign-in
- `ProtectedRoute` component wraps all private pages — uses `onAuthStateChanged` to rehydrate session on refresh without a flicker
- Unauthenticated users are silently redirected to `/login`
- A branded loading spinner is shown while Firebase resolves the auth state

### Global State — Zustand Store
All cross-cutting app state (auth user, theme preference, notifications) lives in a single Zustand store with `persist` middleware. Only non-sensitive UI state (theme, view mode, notifications) is persisted to `localStorage` — the Firebase `User` object is intentionally excluded.

### Notifications (Service Worker)
- Registers a Service Worker (`/sw.js`) on mount
- Requests browser notification permission on first interaction
- Prefers SW-based notifications (work even when the tab is backgrounded) with a fallback to the basic Notifications API
- Six pre-built demo notification events: patient admissions, vitals alerts, lab results, insurance claim updates, and appointment reminders
- An in-app `NotificationsPanel` mirrors all fired notifications with read/unread state, mark-all-read, and clear-all actions

### Dark Mode
- System-level dark mode toggle via Tailwind's `dark:` variant
- Theme is persisted to `localStorage` through Zustand and applied by adding/removing the `dark` class on `<html>` inside a dedicated `ThemeProvider` component

---

## Pages

### Login (`/login`)
Clean, centred login form with Firebase Auth integration. Displays inline error messages for invalid credentials.

### Dashboard (`/dashboard`)
- KPI stat cards: Total Patients, Active Cases, Avg Recovery, Revenue
- Admits vs Discharges bar chart (7-day trend)
- Department load area chart
- Recent patient activity feed
- Insurance claim status summary

### Analytics (`/analytics`)
- Monthly revenue line chart with a reference line for targets
- Patient outcome breakdown (Recharts `PieChart` with a custom `PieLabel` render function)
- Department distribution donut chart
- Bed occupancy trend area chart
- Staff performance and top department summary cards

### Patient Details (`/patients`)
The most feature-rich page:
- **Dual view modes** — Grid (card layout) and List (table-style rows), toggled with a single button in the Navbar
- **Live search** — filters patients by name, condition, or doctor as you type (client-side, using `useMemo`)
- **Multi-filter** — filter by Risk Level and Insurance Status independently; active filter count badge updates dynamically
- **Sort** — by Name, Age, Admission Date, or Risk Level (ascending/descending)
- **Patient cards** show: avatar with initials + colour coding, condition, risk badge, insurance status icon, assigned doctor, and last-updated timestamp
- All filters, sort, and view state are managed with local `useState` + `useMemo` — no external library needed

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Top navigation, notifications bell, theme toggle, view toggle
│   ├── NotificationsPanel.tsx  # Slide-in panel with in-app notification feed
│   ├── ProtectedRoute.tsx      # Auth guard with loading state
│   ├── ThemeProvider.tsx       # Applies dark class to <html> from Zustand state
│   └── ThemeToggle.tsx         # Sun/Moon toggle button
├── lib/
│   ├── firebase.ts             # Firebase app + Auth initialisation
│   └── notifications.ts        # SW registration, permission request, demo event payloads
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── AnalyticsPage.tsx
│   └── PatientsPage.tsx
├── store/
│   └── authStore.ts            # Zustand store: auth, theme, notifications, view mode
└── main.tsx
```

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/DeepthiM15/medAxis_b2b_healthcare_ui.git
cd medAxis_b2b_healthcare_ui

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your Firebase project values in .env

# 4. Run development server
npm run dev
```

### Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Key Implementation Decisions

**Why Zustand over Context/Redux?**  
Zustand gives a flat, boilerplate-free store that's easy to co-locate with related actions. The `persist` middleware handles localStorage serialisation with one line. For an app of this scale it's the right trade-off between simplicity and capability.

**Why Service Worker for notifications?**  
The Web Notifications API alone only works while the tab is active and focused. Routing through the Service Worker (`showNotification` on the registration object) allows notifications to fire even when the user has switched tabs — closer to what a real healthcare alerting system would need.

**Why `useMemo` for patient filtering?**  
Search, filters, and sort run on every keystroke. Wrapping the derived list in `useMemo` ensures the filter/sort computation only re-runs when the actual data or filter values change, not on unrelated re-renders.

---

## Deployment

Deployed on **Vercel** via GitHub integration. Each push to `main` triggers an automatic production deployment.  
Firebase credentials are stored as Vercel Environment Variables — not in the repository.
