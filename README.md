# Sales Intel — Conversation Intelligence Tracker

A lightweight sales tool for logging customer interactions, tracking objection responses, and surfacing winning patterns over time.

---

## ✨ Features

- **Log interactions** — Record customer objections, your response, and the outcome
- **4 outcome types** — Win, Loss, Follow-Up, Pending
- **Pattern analysis** — Automatically surfaces which responses win most for each objection type
- **Keyword analysis** — Shows most frequent objection words
- **Dashboard** — Win rate, counts, trend indicator, and quick intel summary
- **Auth** — Email/password + Google sign-in via Firebase
- **Per-user data** — Each user only sees their own interactions

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- A Firebase project (free tier works)

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Email/Password**
   - Enable **Google**
4. Enable **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in **production mode**
   - Choose a region close to your users
5. Set up **Firestore Security Rules** (see below)
6. Get your config:
   - Project Settings → General → Your apps → Web app
   - Copy the `firebaseConfig` values

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Firebase values in `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firestore Security Rules

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /interactions/{docId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 6. Run the development server

```bash
npm run dev
```

---

## 📦 Deploying to Vercel

### Option A: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: Via Vercel Dashboard

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework preset: **Vite**
4. Add environment variables (same as `.env.local`) in the Vercel dashboard:
   - Project Settings → Environment Variables
   - Add all `VITE_FIREBASE_*` variables
5. Deploy!

> The `vercel.json` file is already configured for SPA routing.

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # Email/password + Google login
│   │   ├── RegisterForm.tsx       # Registration form
│   │   └── AuthForms.module.css
│   ├── dashboard/
│   │   ├── StatsCard.tsx          # Metric display card
│   │   └── Dashboard.module.css
│   ├── interactions/
│   │   ├── InteractionForm.tsx    # Create/edit form
│   │   ├── InteractionCard.tsx    # Single interaction display
│   │   ├── InteractionList.tsx    # Filtered list with search
│   │   └── Interactions.module.css
│   ├── insights/
│   │   ├── PatternCard.tsx        # Objection pattern accordion
│   │   └── Insights.module.css
│   └── layout/
│       ├── Navbar.tsx             # Top navigation
│       ├── Navbar.module.css
│       └── ProtectedRoute.tsx     # Auth guard
├── contexts/
│   └── AuthContext.tsx            # Firebase auth state + methods
├── hooks/
│   └── useInteractions.ts         # CRUD operations + state
├── lib/
│   ├── firebase.ts                # Firebase initialization
│   └── firestore.ts               # Firestore data access layer
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── InteractionsPage.tsx
│   ├── InsightsPage.tsx
│   └── Pages.module.css
├── types/
│   └── index.ts                   # TypeScript interfaces
├── utils/
│   └── patterns.ts                # Pattern analysis algorithms
├── App.tsx                        # Router + auth provider
├── main.tsx                       # Entry point
└── index.css                      # Global styles + CSS variables
```

---

## 🎨 Design System

Built with CSS custom properties (no external UI library):

- **Font Display**: Bebas Neue (headings)
- **Font Body**: DM Sans (UI)
- **Font Mono**: JetBrains Mono (data/labels)
- **Theme**: Dark intelligence briefing — navy backgrounds, amber/gold accents

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Auth + DB | Firebase (Auth + Firestore) |
| Routing | React Router v6 |
| Styling | CSS Modules + CSS Variables |
| Icons | Lucide React |
| Dates | date-fns |
| Deploy | Vercel |
