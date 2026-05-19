import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "auth_token";

export type SessionUser = {
  id: string;
  name: string;
  role: "client" | "admin";
};

type JwtPayload = { userId: string; role: "client" | "admin"; exp?: number };

function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = Buffer.from(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}

export async function getSession(): Promise<{
  token: string;
  userId: string;
  role: "client" | "admin";
  user: SessionUser | null;
} | null> {
  const token = await getToken();
  if (!token) return null;
  const payload = decodeJwt(token);
  if (!payload?.userId) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;

  const jar = await cookies();
  const userCookie = jar.get("auth_user")?.value;
  let user: SessionUser | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie) as SessionUser;
    } catch {
      user = null;
    }
  }
  return { token, userId: payload.userId, role: payload.role, user };
}

export async function setSessionCookies(token: string, user: SessionUser) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  jar.set("auth_user", JSON.stringify(user), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  jar.delete("auth_user");
}
