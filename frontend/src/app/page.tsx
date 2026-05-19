import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="space-y-10">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Book your appointment
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          A tiny demo of a Node.js / MongoDB backend wrapped in a Next.js 16 frontend
          with server-side rendering and Redis-cached responses.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/slots">
            <Button size="lg">Browse slots</Button>
          </Link>
          {!session && (
            <Link href="/register">
              <Button size="lg" variant="outline">
                Create account
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>SSR data fetching</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            All pages render on the server. The JWT lives in an httpOnly cookie, so
            tokens never leak to the browser.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Redis-cached API</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Slot listings are cached server-side in Redis with a short TTL and
            invalidated on every booking.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Role-aware UI</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Admins get an extra panel for slot creation and a full overview of every
            appointment in the system.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
