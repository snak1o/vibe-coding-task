# Prompts Log

Здесь записаны (перефразированные на английский) ключевые промпты, которые использовались при vibe-coding фронтенда поверх существующего Node.js/MongoDB backend (appointment booking system).

---

## 1. Project bootstrap

> We have an existing Node.js/Express/MongoDB backend (appointment booking app: auth, slots, appointments). Now we need to build a modern Next.js frontend on top of it. Use **Next.js (App Router) with SSR**, and **Redis for server-side caching** (not browser caching). Create a clean monorepo layout (`backend/`, `frontend/`), add a proper root `.gitignore` (ignore `node_modules`, `.env*`, `.next`, `.DS_Store`, `.idea`). Initialize a single git repository at the project root, do an initial commit containing only the backend, and prepare to push to `https://github.com/snak1o/vibe-coding-task.git`. Propose an implementation plan before writing code.

---

## 2. Stack decisions

> Use Redis via local Docker (`redis:alpine` on port 6379), shadcn/ui as the component library, and include the admin panel in the frontend as well (slot CRUD). **Do not modify the backend at all** — since all calls to the API are made server-side from Next.js, CORS is not needed. Commit frequently with conventional commit messages.

## 3. Frontend scaffolding

> Scaffold a Next.js 16 app inside `frontend/` using TypeScript, the App Router, Tailwind v4, ESLint, the `src/` directory and the `@/*` import alias. Install `ioredis`, initialise shadcn/ui with the default style, and add these components: `button`, `card`, `input`, `label`, `badge`, `separator`, `dialog`, `sonner`. Add `.env.example` and `.env.local` with `API_BASE_URL=http://localhost:3000/api`, `REDIS_URL=redis://localhost:6379`, `AUTH_COOKIE_NAME=auth_token`.

## 4. Core libraries (server-only)

> Create three server-side modules in `src/lib`:
>
> 1. `redis.ts` — a singleton `ioredis` client (reused across hot reloads in dev), plus `cacheGet`, `cacheSet`, `cacheDel`, and a `cached(key, ttlSeconds, loader)` helper that returns `{ data, hit }`. Centralise cache keys in a `CacheKeys` object.
> 2. `session.ts` — `getToken()`, `getSession()`, `setSessionCookies(token, user)`, `clearSessionCookies()`. The JWT goes into an `httpOnly` cookie; a non-httpOnly companion cookie `auth_user` holds `{id, name, role}` for the navbar. Decode the JWT with `Buffer.from(...)` (no `jsonwebtoken` on the client side).
> 3. `api.ts` — a typed wrapper around `fetch` that targets `API_BASE_URL`, marks calls as `cache: 'no-store'` (server cache lives in Redis only), and exposes `api.login / register / listSlots / createSlot / deleteSlot / bookAppointment / myAppointments / allAppointments / cancelAppointment`. Mark these modules as `import "server-only"`.

## 5. Server actions

> Add `src/app/actions.ts` with `"use server"`. Implement: `loginAction`, `registerAction` (both `useActionState`-compatible — they accept `(prev, formData)` and return `{ok, message}`), `logoutAction`, `bookSlotAction`, `cancelAppointmentAction`, `createSlotAction`, `deleteSlotAction`. After every mutation, invalidate the relevant Redis keys with `cacheDel(...)` AND call `revalidatePath()` for affected routes. Redirect to `/slots` after login/register.

## 6. UI

> Build the following pages using shadcn/ui (`Card`, `Button`, `Badge`, `Input`, `Label`, `Separator`):
>
> - Root `layout.tsx` with a sticky `NavBar` that shows login state and an admin badge.
> - `/` landing page with hero + three feature cards.
> - `/login`, `/register` — client forms wired with `useActionState`.
> - `/slots` (SSR) — list of slots from Redis-cached `api.listSlots`. Show a `cache HIT/MISS` badge. Each slot card has a `Book` button (server action). Logged-out users see a `Log in to book` link instead.
> - `/my` (SSR, auth required) — current user's appointments with `Cancel` buttons.
> - `/admin` (SSR, admin only) — create-slot form, grid of all slots with delete buttons, and a table of all appointments with cancel buttons.
>
> Add a `formatRange(startISO, endISO)` helper.

## 7. Infrastructure

> Add a root `docker-compose.yml` with a single `redis:7-alpine` service mapped to `localhost:6379`, no persistence.


