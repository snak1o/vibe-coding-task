"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { CacheKeys, cacheDel } from "@/lib/redis";
import {
  clearSessionCookies,
  getSession,
  setSessionCookies,
} from "@/lib/session";

export type ActionState = { ok: boolean; message?: string };

function errMsg(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: string }).message ?? "Unknown error");
  }
  return "Unknown error";
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Email and password are required" };
  try {
    const res = await api.login({ email, password });
    await setSessionCookies(res.token, res.user);
  } catch (err) {
    return { ok: false, message: errMsg(err) };
  }
  redirect("/slots");
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "admin" ? "admin" : "client";
  if (!name || !email || !password) return { ok: false, message: "All fields are required" };
  try {
    await api.register({ name, email, password, role });
    const login = await api.login({ email, password });
    await setSessionCookies(login.token, login.user);
  } catch (err) {
    return { ok: false, message: errMsg(err) };
  }
  redirect("/slots");
}

export async function logoutAction() {
  await clearSessionCookies();
  redirect("/login");
}

export async function bookSlotAction(formData: FormData): Promise<void> {
  const slotId = String(formData.get("slotId") ?? "");
  if (!slotId) return;
  const session = await getSession();
  if (!session) redirect("/login");
  try {
    await api.bookAppointment(slotId);
    await cacheDel(
      CacheKeys.slotsAll,
      CacheKeys.slotsAvailable,
      CacheKeys.myAppointments(session.userId),
      CacheKeys.allAppointments,
    );
  } catch (err) {
    console.error("[bookSlotAction]", errMsg(err));
  }
  revalidatePath("/slots");
  revalidatePath("/my");
}

export async function cancelAppointmentAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const session = await getSession();
  if (!session) redirect("/login");
  try {
    await api.cancelAppointment(id);
    await cacheDel(
      CacheKeys.slotsAll,
      CacheKeys.slotsAvailable,
      CacheKeys.myAppointments(session.userId),
      CacheKeys.allAppointments,
    );
  } catch (err) {
    console.error("[cancelAppointmentAction]", errMsg(err));
  }
  revalidatePath("/slots");
  revalidatePath("/my");
  revalidatePath("/admin");
}

export async function createSlotAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");
  if (!start || !end) return { ok: false, message: "Start and end are required" };
  try {
    const startISO = new Date(start).toISOString();
    const endISO = new Date(end).toISOString();
    await api.createSlot({ start: startISO, end: endISO });
    await cacheDel(CacheKeys.slotsAll, CacheKeys.slotsAvailable);
  } catch (err) {
    return { ok: false, message: errMsg(err) };
  }
  revalidatePath("/slots");
  revalidatePath("/admin");
  return { ok: true, message: "Slot created" };
}

export async function deleteSlotAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    await api.deleteSlot(id);
    await cacheDel(CacheKeys.slotsAll, CacheKeys.slotsAvailable);
  } catch (err) {
    console.error("[deleteSlotAction]", errMsg(err));
  }
  revalidatePath("/slots");
  revalidatePath("/admin");
}
