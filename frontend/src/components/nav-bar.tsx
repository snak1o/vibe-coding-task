import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function NavBar() {
  const session = await getSession();
  const role = session?.role;
  const name = session?.user?.name;

  return (
    <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-semibold tracking-tight">
          Appointment Booking
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/slots"
            className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            Slots
          </Link>
          {session && (
            <Link
              href="/my"
              className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
            >
              My appointments
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {name ?? "Account"}
              </span>
              {role === "admin" && <Badge variant="secondary">admin</Badge>}
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
