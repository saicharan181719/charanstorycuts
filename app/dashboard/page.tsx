"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ClientDashboard from "./ClientDashboard";
import AdminView from "../admin/page"; // 👈 reuse existing admin page

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const ADMIN_EMAIL = "charanstorycuts@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      if (user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return isAdmin ? <AdminView /> : <ClientDashboard />;
}