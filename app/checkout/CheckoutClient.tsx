"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const bookingId = sp.get("bookingId");

  if (!bookingId) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-2xl font-semibold">Payment</h1>

        <p className="text-white/60 mt-3 text-sm">
          Booking ID
        </p>

        <div className="mt-2 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm">
          {bookingId}
        </div>

        <button
          onClick={() => alert("Payment integration next")}
          className="mt-6 w-full bg-white text-black py-3 rounded-full font-medium hover:scale-105 transition"
        >
          Pay Now →
        </button>
      </div>
    </div>
  );
}
