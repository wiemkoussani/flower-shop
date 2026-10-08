"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccountLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} disabled={loading} className="text-sm tracking-wide uppercase text-muted hover:text-magenta">
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}
