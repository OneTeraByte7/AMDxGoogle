# 🥗 NutriVita — Food & Health Assistant

A full-stack, production-ready web application for nutrition tracking, AI-powered meal suggestions, and discovering healthy food stores nearby.

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Demo User** | Local demo user — no external auth required |
| 👤 **Smart Profile Setup** | BMR-based calorie target calculation |
| 🍽️ **Food Logging** | Search via Edamam API, log portions, auto-calculate macros |
| 📊 **Dashboard** | Calorie progress, pie/line charts, water tracker |
| 🤖 **Smart Assistant** | Rule-based context-aware chat — no LLM needed |
| 🗺️ **Nearby Map** | Google Maps + Places API to find health food stores |
| 🌙 **Dark/Light Theme** | Toggle with localStorage persistence |

---

## 🗂 Project Structure

```
food-health-app/
├── server/           # Node.js + Express backend
│   ├── src/
│   │   ├── routes/       # auth, food, logs, assistant, places
│   │   ├── controllers/  # route handlers
│   │   ├── services/     # localDb, edamam, assistantLogic
│   │   ├── middleware/   # auth token verification, error handler
│   │   ├── utils/        # calorieCalc (Mifflin-St Jeor BMR)
│   │   └── config/       # centralised env config
│   ├── tests/        # Jest + Supertest API tests
│   ├── Dockerfile
│   └── .env.example
└── client/           # React + Vite frontend
    ├── src/
    │   ├── pages/        # Landing, Dashboard, FoodLog, Assistant, ProfileSetup, NotFound
    │   ├── components/   # common, dashboard, foodlog, assistant, maps
    │   ├── context/      # AuthContext, ThemeContext
    │   ├── services/     # local DB shim, api.js (Axios)
    │   └── hooks/        # useUserProfile
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Optional: Edamam API account, Google Maps API key

### 1. Clone & install

```bash
git clone <your-repo>
cd food-health-app

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### Environment variables

**Server** — copy `server/.env.example` to `server/.env` and set optional API keys:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Edamam (optional — mock data used if absent)
EDAMAM_APP_ID=your_app_id
EDAMAM_APP_KEY=your_app_key

# Google Maps (optional — mock markers shown if absent)
GOOGLE_MAPS_API_KEY=your_api_key
```

**Client** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_key  # Optional
```

### 4. Apply Firestore Security Rules

In the Firebase Console → Firestore → Rules tab — paste the contents of `firestore.rules`.

### 5. Run locally

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open **http://localhost:5173**

---

## 🧪 Running Tests

```bash
cd server
npm test
```

Jest + Supertest covers:
- `GET /api/food/search` — query validation + mock fallback
- `POST /api/logs` — CRUD + macro calculation
- `POST /api/assistant/message` — reply structure + unit tests for `assistantLogic`

---

## 🌐 API Keys

### Edamam Nutrition API
1. Register at [developer.edamam.com](https://developer.edamam.com/)
2. Create a **Food Database** app → copy App ID and App Key
3. Set `EDAMAM_APP_ID` and `EDAMAM_APP_KEY` in `server/.env`

> **Without a key:** The app uses built-in mock food data (8 common foods) — the UI still works fully.

### Google Maps / Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Places API**
3. Create an API key (restrict to your domain in production)
4. Set `GOOGLE_MAPS_API_KEY` in `server/.env` and `VITE_GOOGLE_MAPS_API_KEY` in `client/.env`

> **Without a key:** Mock store markers appear on the map.

---

## ☁️ Deployment

### Frontend → Vercel

1. Push your repo to GitHub
2. Import the repo at [vercel.com](https://vercel.com/)
3. Set **Root Directory** to `client`
4. Add all `VITE_*` environment variables in Vercel project settings
5. Deploy — `vercel.json` handles SPA routing

### Backend → Render

1. Create a **New Web Service** at [render.com](https://render.com)
2. Connect your repo, set **Root Directory** to `server`
3. **Build command:** `npm install`
4. **Start command:** `node server.js`
5. Add all environment variables from `server/.env.example`
6. Update `CLIENT_ORIGIN` to your Vercel frontend URL
7. Update `VITE_API_BASE_URL` in your Vercel env vars to the Render service URL

### Backend → Docker

```bash
cd server
docker build -t nutrivita-server .
docker run -p 5000:5000 --env-file .env nutrivita-server
```

---

## 🔒 Security

- **Firebase Security Rules** — users can only access their own Firestore documents
- **Helmet.js** — sets security headers
- **Rate limiting** — 100 requests per 15 minutes per IP
- **JWT verification** — all `/api/*` routes (except health check) require a valid Firebase ID token
- **Joi validation** — all request bodies and query params validated server-side
- **CORS** — only allows the configured `CLIENT_ORIGIN`

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#6C63FF` (Royal Purple) |
| Secondary | `#FFD700` (Gold) |
| Background | `#121212` |
| Surface | `#1E1E1E` |
| Text | `#F5F5F5` |
| Heading font | Playfair Display |
| Body font | Poppins |

Glassmorphism cards, Framer Motion page transitions, and animated charts are used throughout.

---

## 📝 License

MIT — free to use, modify, and distribute.
