# Prompts Log

Здесь записаны (перефразированные на английский) ключевые промпты, которые использовались при vibe-coding фронтенда поверх существующего Node.js/MongoDB backend (appointment booking system).

---

## 1. Project bootstrap

> We have an existing Node.js/Express/MongoDB backend (appointment booking app: auth, slots, appointments). Now we need to build a modern Next.js frontend on top of it. Use **Next.js (App Router) with SSR**, and **Redis for server-side caching** (not browser caching). Create a clean monorepo layout (`backend/`, `frontend/`), add a proper root `.gitignore` (ignore `node_modules`, `.env*`, `.next`, `.DS_Store`, `.idea`). Initialize a single git repository at the project root, do an initial commit containing only the backend, and prepare to push to `https://github.com/snak1o/vibe-coding-task.git`. Propose an implementation plan before writing code.

---

## 2. Stack decisions

> Use Redis via local Docker (`redis:alpine` on port 6379), shadcn/ui as the component library, and include the admin panel in the frontend as well (slot CRUD). **Do not modify the backend at all** — since all calls to the API are made server-side from Next.js, CORS is not needed. Commit frequently with conventional commit messages.

