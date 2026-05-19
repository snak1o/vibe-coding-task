import { redirect } from "next/navigation";
import { api, type Appointment, type Slot } from "@/lib/api";
import { cached, CacheKeys } from "@/lib/redis";
import { getSession } from "@/lib/session";
import { cancelAppointmentAction } from "@/app/actions";
import { formatRange } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
const TTL = 15;

function slotOf(a: Appointment): Slot | null {
  return typeof a.slot === "object" ? a.slot : null;
}

export default async function MyAppointmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { data: appointments, hit } = await cached(
    CacheKeys.myAppointments(session.userId),
    TTL,
    () => api.myAppointments(),
  );

  const sorted = [...appointments].sort((a, b) => {
    const sa = slotOf(a)?.start ?? a.createdAt;
    const sb = slotOf(b)?.start ?? b.createdAt;
    return new Date(sa).getTime() - new Date(sb).getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My appointments</h1>
        <p className="text-sm text-muted-foreground">
          <Badge variant={hit ? "default" : "secondary"}>
            {hit ? "Redis cache HIT" : "Redis cache MISS"}
          </Badge>{" "}
          · TTL {TTL}s
        </p>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            You haven&apos;t booked anything yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map((a) => {
            const slot = slotOf(a);
            return (
              <Card key={a._id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {slot ? formatRange(slot.start, slot.end) : "(slot removed)"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Badge variant="outline">{a.status}</Badge>
                  <form action={cancelAppointmentAction}>
                    <input type="hidden" name="id" value={a._id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
