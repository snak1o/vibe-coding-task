import { api } from "@/lib/api";
import { cached, CacheKeys } from "@/lib/redis";
import { getSession } from "@/lib/session";
import { bookSlotAction } from "@/app/actions";
import { formatRange } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SLOTS_TTL_SECONDS = 30;

export default async function SlotsPage() {
  const session = await getSession();
  const { data: slots, hit } = await cached(
    CacheKeys.slotsAll,
    SLOTS_TTL_SECONDS,
    () => api.listSlots(),
  );

  const sorted = [...slots].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available slots</h1>
          <p className="text-sm text-muted-foreground">
            Rendered on the server.{" "}
            <Badge variant={hit ? "default" : "secondary"}>
              {hit ? "Redis cache HIT" : "Redis cache MISS"}
            </Badge>{" "}
            · TTL {SLOTS_TTL_SECONDS}s
          </p>
        </div>
        {session?.role === "admin" && (
          <Link href="/admin">
            <Button variant="outline">Admin panel</Button>
          </Link>
        )}
      </div>

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No slots yet. {session?.role === "admin" ? "Create one in the admin panel." : "Check back later."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((slot) => (
            <Card key={slot._id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base">{formatRange(slot.start, slot.end)}</CardTitle>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between gap-2">
                {slot.isBooked ? (
                  <Badge variant="destructive">Booked</Badge>
                ) : (
                  <Badge variant="secondary">Available</Badge>
                )}
                {!slot.isBooked &&
                  (session ? (
                    <form action={bookSlotAction}>
                      <input type="hidden" name="slotId" value={slot._id} />
                      <Button type="submit" size="sm">
                        Book
                      </Button>
                    </form>
                  ) : (
                    <Link href="/login">
                      <Button size="sm" variant="outline">
                        Log in to book
                      </Button>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
