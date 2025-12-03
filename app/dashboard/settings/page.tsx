import { redirect } from "next/navigation"

// Redirect settings to profile page
export default function SettingsPage() {
  redirect("/dashboard/profile")
}
