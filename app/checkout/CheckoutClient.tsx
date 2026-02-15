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
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      {/* Top Section */}
      <div className="px-8 pt-6 flex items-center justify-between">

        {/* Logo */}
        <img
          src="/charanstorycuts-logo.png"
          alt="charanstorycuts logo"
          className="h-8"
        />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-white/70 hover:text-white transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Center Content */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center shadow-xl">

          <h1 className="text-2xl font-semibold tracking-wide">
            Payment
          </h1>

          <p className="text-white/60 mt-3 text-sm">
            Booking ID
          </p>

          <div className="mt-2 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm tracking-wide">
            {bookingId}
          </div>

          <button
            onClick={() => alert("Payment integration next")}
            className="mt-6 w-full bg-white text-black py-3 rounded-full font-medium transition hover:scale-105 cursor-pointer"
          >
            Pay Now →
          </button>

        </div>
      </div>

      {/* Bottom Branding */}
      <div className="text-center pb-10 px-6">
        <p className="text-white/70 text-sm md:text-base font-semibold tracking-wide">
          charanstorycuts
          <span className="text-white/40 font-normal">
            {" "}— Where Machines Tell Stories
          </span>
        </p>
      </div>

    </div>
  );
}
