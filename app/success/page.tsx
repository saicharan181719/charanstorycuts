"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      router.replace("/dashboard");
      return;
    }

    const fetchBooking = async () => {
      try {
        const snap = await getDoc(doc(db, "bookings", bookingId));
        if (!snap.exists()) {
          router.replace("/dashboard");
          return;
        }
        setBooking(snap.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">

      <div className="absolute top-6 left-6 flex items-center gap-6">
        <img src="/charanstorycuts-logo.png" alt="Logo" className="h-8" />
      </div>

      <div className="max-w-4xl mx-auto text-center">

        {/* Success Badge */}
        <div className="text-green-400 text-lg font-medium">
          Payment Successful ✓
        </div>

        <h1 className="text-4xl font-semibold mt-4">
          Booking Confirmed
        </h1>

        <p className="text-white/60 mt-2">
          Thank you for choosing charanstorycuts.
        </p>

        {/* Booking Summary */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-left">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

            <div>
              <div className="text-white/50">Booking ID</div>
              <div className="font-medium">{bookingId}</div>
            </div>

            <div>
              <div className="text-white/50">Payment ID</div>
              <div className="font-medium">{booking.paymentId}</div>
            </div>

            <div>
              <div className="text-white/50">Name</div>
              <div className="font-medium">{booking.fullName}</div>
            </div>

            <div>
              <div className="text-white/50">Mobile</div>
              <div className="font-medium">{booking.phone}</div>
            </div>

            <div>
              <div className="text-white/50">Vehicle</div>
              <div className="font-medium">
                {booking.vehicleModel} ({booking.vehicle})
              </div>
            </div>

            <div>
              <div className="text-white/50">Package</div>
              <div className="font-medium">{booking.packageLabel}</div>
            </div>

            <div>
              <div className="text-white/50">City</div>
              <div className="font-medium">{booking.city}</div>
            </div>

          </div>

          <div className="mt-8 border-t border-white/10 pt-6 flex justify-between items-center">
            <div className="text-white/50">Amount Paid</div>
            <div className="text-3xl font-semibold text-green-400">
              ₹{booking.finalPrice}
            </div>
          </div>

        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-10 bg-white text-black px-8 py-3 rounded-full font-medium hover:scale-105 transition cursor-pointer"
        >
          Back to Dashboard →
        </button>

        <div className="mt-10 text-white/40 text-sm italic">
          charanstorycuts — Where Machines Tell Stories
        </div>

      </div>
    </div>
  );
}