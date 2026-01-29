import { Suspense } from "react";
import BookingClient from "./BookingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white p-6">
          Loading booking…
        </div>
      }
    >
      <BookingClient />
    </Suspense>
  );
}
