"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CheckoutPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const bookingId = sp.get("bookingId");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Fallback (if someone opens checkout directly)
  const fallback = {
    vehicle: sp.get("vehicle") || "",
    pack: sp.get("pack") || "",
    basePrice: Number(sp.get("basePrice") || "0"),
    finalPrice: Number(sp.get("finalPrice") || "0"),
    offerActive: sp.get("offerActive") === "1",
  };

  useEffect(() => {
    const run = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }

      if (!bookingId) {
        setData(fallback);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "bookings", bookingId));
      if (!snap.exists()) {
        setData(fallback);
        setLoading(false);
        return;
      }

      setData({ id: bookingId, ...snap.data() });
      setLoading(false);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const payNow = async () => {
    // Payment integration later. For now simulate success.
    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }

      // If booking exists, mark as paid (simulated)
      if (data?.id) {
        await updateDoc(doc(db, "bookings", data.id), {
          paymentStatus: "paid",
          bookingStatus: "confirmed",
        });

        // consume offer if applied
        if (data.offerApplied) {
          await updateDoc(doc(db, "users", user.uid), { offerUsed: true });
        }
      } else {
        // If no booking doc, still consume offer using query param
        if (fallback.offerActive) {
          await updateDoc(doc(db, "users", user.uid), { offerUsed: true });
        }
      }

      alert("✅ Payment Success (simulated)\nNext: Real UPI integration");
      router.push("/dashboard");
    } catch {
      alert("Payment failed. Try again.");
    }
  };

  if (loading) return null;

  const vehicle = (data?.vehicle || "").toUpperCase();
  const pack = data?.packageLabel || data?.pack || "";
  const basePrice = Number(data?.basePrice || fallback.basePrice || 0);
  const finalPrice = Number(data?.finalPrice || fallback.finalPrice || 0);
  const offerApplied = !!data?.offerApplied || fallback.offerActive;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-sm text-white/70 hover:text-white transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold mt-4">Checkout</h1>
        <p className="text-white/60 mt-2 text-sm">
          Confirm your booking and proceed to payment.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Selected</div>
          <div className="mt-2 text-lg">
            <span className="font-semibold">{vehicle}</span> —{" "}
            <span className="text-white/80">{pack}</span>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="text-sm text-white/60">Amount</div>
              <div className="text-3xl font-semibold mt-1">₹{finalPrice}</div>

              {offerApplied && basePrice > 0 && (
                <div className="text-xs text-white/40 mt-1">
                  Offer applied (original{" "}
                  <span className="line-through">₹{basePrice}</span>)
                </div>
              )}
            </div>

            <button
              onClick={payNow}
              className="bg-white text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition"
            >
              Pay Now →
            </button>
          </div>

          {data?.fullName && (
            <div className="mt-6 text-xs text-white/50">
              Booking for <span className="text-white/70">{data.fullName}</span>{" "}
              • {data.phone} • {data.city}
              <br />
              {data.location} • {data.vehicleModel} • {data.date} {data.time}
            </div>
          )}

          <p className="mt-4 text-xs text-white/50">
            Next: Real UPI payments (GPay/PhonePe) + admin notification after payment.
          </p>
        </div>
      </div>
    </div>
  );
}
