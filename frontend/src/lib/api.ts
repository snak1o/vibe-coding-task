import "server-only";
import { getToken } from "./session";

const BASE = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export type ApiError = { status: number; message: string };

async function request<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (init.auth) {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (data && typeof data === "object" && "message" in data) {
      const m = (data as { message?: unknown }).message;
      if (typeof m === "string" && m.length > 0) message = m;
    }
    const err: ApiError = { status: res.status, message };
    throw err;
  }
  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ---------- Types mirroring backend ----------
export type Slot = {
  _id: string;
  start: string;
  end: string;
  isBooked: boolean;
};

export type Appointment = {
  _id: string;
  slot: Slot | string;
  user: { _id: string; name: string; email: string } | string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export type AuthLoginResponse = {
  token: string;
  user: { id: string; name: string; role: "client" | "admin" };
};

// ---------- Auth ----------
export const api = {
  login: (body: { email: string; password: string }) =>
    request<AuthLoginResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: { name: string; email: string; password: string; role?: "client" | "admin" }) =>
    request<{ message: string }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  // Slots
  listSlots: () => request<Slot[]>("/slots", { method: "GET" }),
  createSlot: (body: { start: string; end: string }) =>
    request<Slot>("/slots", { method: "POST", body: JSON.stringify(body), auth: true }),
  deleteSlot: (id: string) =>
    request<{ message: string }>(`/slots/${id}`, { method: "DELETE", auth: true }),

  // Appointments
  bookAppointment: (slotId: string) =>
    request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify({ slotId }),
      auth: true,
    }),
  myAppointments: () =>
    request<Appointment[]>("/appointments/my", { method: "GET", auth: true }),
  allAppointments: () =>
    request<Appointment[]>("/appointments/all", { method: "GET", auth: true }),
  cancelAppointment: (id: string) =>
    request<{ message: string }>(`/appointments/${id}`, { method: "DELETE", auth: true }),
};
