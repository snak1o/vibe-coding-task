import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/slots");
  return <LoginForm />;
}
