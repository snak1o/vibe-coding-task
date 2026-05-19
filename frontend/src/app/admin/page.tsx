import { redirect } from "next/navigation";
import { api, type Appointment, type Slot } from "@/lib/api";
import { cached, CacheKeys } from "@/lib/redis";
import { getSession } from "@/lib/session";
import {
  cancelAppointmentAction,
  deleteSlotAction,
} from "@/app/actions";
import CreateSlotForm from "./create-slot-form";
import { formatRange } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";
const SLOTS_TTL = 30;
const APPS_TTL = 15;

function slotOf(a: Appointment): Slot | null {
  return typeof a.slot === "object" ? a.slot : null;
}
function userOf(a: Appointment) {
  return typeof a.user === "object" ? a.user : null;
}

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/slots");

  const [{ data: slots, hit: slotsHit }, { data: appointments, hit: appsHit }] =
    await Promise.all([
      cached(CacheKeys.slotsAll, SLOTS_TTL, () => api.listSlots()),
      cached(CacheKeys.allAppointments, APPS_TTL, () => api.allAppointments()),
    ]);

  const sortedSlots = [...slots].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
  const sortedApps = [...appointments].sort((a, b) => {
    const sa = slotOf(a)?.start ?? a.createdAt;
    const sb = slotOf(b)?.start ?? b.createdAt;
    return new Date(sa).getTime() - new Date(sb).getTime();
  });

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Admin panel</h1>
        <p className="text-sm text-muted-foreground">
          Manage slots and appointments. All data is fetched on the server and cached in Redis.
        </p>
      </header>

      <CreateSlotForm />

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">All slots ({sortedSlots.length})</h2>
          <Badge variant={slotsHit ? "default" : "secondary"}>
            {slotsHit ? "cache HIT" : "cache MISS"}
          </Badge>
        </div>
        <Separator />
        {sortedSlots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No slots yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedSlots.map((s) => (
              <Card key={s._id}>
                <CardHeader>
                  <CardTitle className="text-base">{formatRange(s.start, s.end)}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  {s.isBooked ? (
                    <Badge variant="destructive">Booked</Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                  <form action={deleteSlotAction}>
                    <input type="hidden" name="id" value={s._id} />
                    <Button type="submit" variant="outline" size="sm">
                      Delete
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">All appointments ({sortedApps.length})</h2>
          <Badge variant={appsHit ? "default" : "secondary"}>
            {appsHit ? "cache HIT" : "cache MISS"}
          </Badge>
        </div>
        <Separator />
        {sortedApps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border bg-card">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="[&>th]:px-4 [&>th]:py-2 [&>th]:font-medium border-b">
                  <th>When</th>
                  <th>User</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedApps.map((a) => {
                  const s = slotOf(a);
                  const u = userOf(a);
                  return (
                    <tr key={a._id} className="[&>td]:px-4 [&>td]:py-2 border-b last:border-b-0">
                      <td>{s ? formatRange(s.start, s.end) : "—"}</td>
                      <td>{u ? `${u.name} (${u.email})` : "—"}</td>
                      <td>
                        <Badge variant="outline">{a.status}</Badge>
                      </td>
                      <td className="text-right">
                        <form action={cancelAppointmentAction}>
                          <input type="hidden" name="id" value={a._id} />
                          <Button type="submit" size="sm" variant="destructive">
                            Cancel
                          </Button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
