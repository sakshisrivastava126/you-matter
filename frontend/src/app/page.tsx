import { redirect } from "next/navigation";

// Root route: always redirect to /login
// AuthGuard in the dashboard layout handles the redirect to /dashboard if already logged in
export default function Home() {
  redirect("/login");
}
