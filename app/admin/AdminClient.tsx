"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function AdminClient() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    setEmail(user?.email ?? null);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-white/60">
        Logged in as: {email ?? "Loading..."}
      </p>

      <div className="mt-8 text-white/70">
        Booking management coming next…
      </div>
    </div>
  );
}
