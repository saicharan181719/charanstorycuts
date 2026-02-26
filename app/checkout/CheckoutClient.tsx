"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const bookingId = sp.get("bookingId");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

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

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [bookingId, router]);

  const handlePayment = async () => {
    try {
      setPayLoading(true);

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const orderData = await orderRes.json();

      if (!orderData.order) {
        alert("Failed to create order");
        setPayLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: "INR",
        name: "CharanStoryCuts",
        description: "Video Shoot Booking",
        order_id: orderData.order.id,

        handler: async function (response: any) {
          try {
            // 🔥 WAIT for verification
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              window.location.href = `/success?bookingId=${bookingId}`;
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Something went wrong during verification.");
          }
        },

        theme: {
          color: "#ffffff",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

      setPayLoading(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setPayLoading(false);
    }
  };

  if (loading || !booking) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* Top Bar */}
      <div className="absolute top-6 left-6 flex items-center gap-6">
        <img src="/charanstorycuts-logo.png" alt="Logo" className="h-8" />
        <button
          onClick={() => router.back()}
          className="text-sm text-white/60 hover:text-white transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-10">

        <h1 className="text-4xl font-semibold">Confirm Your Booking</h1>
        <p className="text-white/60 mt-2">
          Please review your booking before payment.
        </p>

        {/* Booking Summary */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

            <div>
              <div className="text-white/50">Name</div>
              <div className="font-medium">{booking.fullName}</div>
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
            <div className="text-white/50">Total Payable</div>
            <div className="text-3xl font-semibold">
              ₹{booking.finalPrice}
            </div>
          </div>

        </div>

        <button
          onClick={handlePayment}
          disabled={payLoading}
          className="mt-10 w-full bg-white text-black py-4 rounded-full font-medium hover:scale-105 transition cursor-pointer"
        >
          {payLoading ? "Processing..." : "Pay Now →"}
        </button>

        <div className="mt-10 text-center text-white/40 text-sm">
          charanstorycuts — Where Machines Tell Stories
        </div>

      </div>
    </div>
  );
}