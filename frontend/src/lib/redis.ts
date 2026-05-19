import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

function createClient(): Redis {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";
  const client = new Redis(url, {
    lazyConnect: false,
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
  });
  client.on("error", (err) => {
    console.warn("[redis] error:", err.message);
  });
  return client;
}

export const redis: Redis = global.__redis ?? createClient();
if (process.env.NODE_ENV !== "production") {
  global.__redis = redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    /* ignore cache errors */
  }
}

export async function cacheDel(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    /* ignore */
  }
}

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<{ data: T; hit: boolean }> {
  const cachedValue = await cacheGet<T>(key);
  if (cachedValue !== null) return { data: cachedValue, hit: true };
  const data = await loader();
  await cacheSet(key, data, ttlSeconds);
  return { data, hit: false };
}

export const CacheKeys = {
  slotsAll: "slots:all",
  slotsAvailable: "slots:available",
  myAppointments: (userId: string) => `appointments:user:${userId}`,
  allAppointments: "appointments:all",
};
