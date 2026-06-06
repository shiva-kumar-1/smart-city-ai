# SmartCity Dashboard v2.0

Full-stack Smart City platform — Traffic Management, Smart Parking, Road Damage Detection, Emergency Services.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Query, Wouter, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer
- **Database**: MongoDB Atlas (cloud) or local MongoDB

## Project Structure
```
smart-city/
├── server/
│   ├── index.js            # Express entry point
│   ├── config/db.js        # MongoDB connection
│   ├── middleware/auth.js  # JWT middleware
│   ├── models/             # Mongoose models
│   └── routes/             # API routes
├── client/
│   └── src/
│       ├── context/        # Auth context
│       ├── pages/          # All pages
│       └── components/     # Layout etc
└── .env                    # Environment variables
```

## Setup

### 1. Fill in your .env
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/smartcity
JWT_SECRET=any_long_random_string
```

### 2. Install & Run
```bash
npm run install:all   # installs both server and client deps
npm run dev           # starts both concurrently
```

Frontend: http://localhost:5173
Backend:  http://localhost:5000

## Features
- **Authentication** — Register/Login with JWT tokens, Citizen & Admin roles
- **Dashboard** — Live aggregated stats from MongoDB
- **Traffic Monitor** — Real-time congestion display, per-road speed & incidents
- **Smart Parking** — Reserve/release slots (auth required), occupancy tracking, pricing
- **Road Damage Detection** — Submit reports with photo upload, AI analysis simulation, admin status management
- **Fuel Stations** — Petrol, Diesel, EV charging points with Google Maps integration
- **Emergency** — Quick links to hospitals, police, fire, ambulance

## Admin Access
To make a user admin, update their role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```
