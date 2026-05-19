# Vibe Coding Task — Appointment Booking

Frontend on top of an existing Node.js/Express/MongoDB backend (group project, untouched). Frontend is **Next.js 16 (App Router) with SSR**, shadcn/ui, Tailwind v4, and **Redis (Docker)** for server-side caching. The JWT lives in an httpOnly cookie — tokens never reach the browser.

## Layout

```
backend/    # original Node.js/Express/MongoDB API (unchanged)
frontend/   # Next.js 16 + shadcn/ui + ioredis
docker-compose.yml   # Redis 7
prompts.md  # English-translated prompts used during vibe-coding
```

## Prerequisites

- Node.js 20+
- Docker (for Redis)
- A MongoDB Atlas connection (already configured in `backend/.env`)

## Run

```bash
# 1. Redis
docker compose up -d

# 2. Backend (port 3000)
cd backend
cp .env.example .env   # fill in DBUSER, DBPASSWORD, JWT_SECRET
npm install
npm start

# 3. Frontend (port 3001)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev -- --port 3001
```

Open http://localhost:3001.

## Features

- Auth: register / login / logout (JWT in `httpOnly` cookie).
- Public slot browsing (SSR + Redis cache, TTL 30s, badge shows HIT/MISS).
- Book and cancel appointments (server actions + Redis cache invalidation).
- Admin panel: create / delete slots, see and cancel any appointment.

## Backend untouched

Because all backend calls are made server-side from Next.js (Node fetch), CORS is not needed and no backend file was modified.
