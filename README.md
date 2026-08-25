# KavachAI — Full Stack Emergency Response Platform

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

---

## 1. Start MongoDB
Make sure MongoDB is running locally on port 27017.
Or update `backend/.env` MONGO_URI with your Atlas connection string.

---

## 2. Setup & Run Backend

```bash
cd backend
npm install
npm run seed       # Creates demo users, ambulances, hospitals
npm run dev        # Starts backend on http://localhost:5000
```

---

## 3. Setup & Run Frontend

```bash
cd frontend
npm install
npm run dev        # Starts frontend on http://localhost:5173
```

---

## Demo Login Accounts

| Role           | Email                  | Password |
|----------------|------------------------|----------|
| Citizen        | citizen@demo.com       | demo123  |
| Dispatcher     | dispatcher@demo.com    | demo123  |
| Driver         | driver@demo.com        | demo123  |
| Hospital Admin | hospital@demo.com      | demo123  |

---

## How It Works

### Architecture
```
Browser (React) → Vite Dev Server (5173) → Proxy → Express API (5000) → MongoDB
                                                  ↕
                                            Socket.io (Real-time)
```

### Flow
1. **Citizen** registers/logs in → requests ambulance with GPS location
2. **Dispatcher** sees real-time alert via Socket.io → assigns ambulance + hospital
3. **Driver** sees active mission → updates status (dispatched → en route → arrived → resolved)
4. **Hospital Admin** sees incoming patient → manages bed availability

### API Endpoints
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET  /api/auth/me` — Get current user
- `GET  /api/emergency` — List emergencies
- `POST /api/emergency` — Create emergency
- `PUT  /api/emergency/:id/dispatch` — Dispatch (dispatcher only)
- `PUT  /api/emergency/:id/status` — Update status
- `GET  /api/ambulance` — List ambulances
- `POST /api/ambulance` — Add ambulance
- `GET  /api/hospital` — List hospitals
- `POST /api/women-safety/sos` — Trigger SOS
- `GET  /api/women-safety/sos/my` — My SOS alerts
