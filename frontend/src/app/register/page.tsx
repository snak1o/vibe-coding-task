import { redirect } from "next/navigation";
import RegisterForm from "./register-form";
import { getSession } from "@/lib/session";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/slots");
  return <RegisterForm />;
}
