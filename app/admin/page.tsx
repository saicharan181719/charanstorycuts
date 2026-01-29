import { Suspense } from "react";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white p-6">
          Loading admin…
        </div>
      }
    >
      <AdminClient />
    </Suspense>
  );
}
