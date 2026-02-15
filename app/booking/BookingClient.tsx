"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type PackageKey = "cinematic" | "rolling" | "combo" | "delivery";

export default function BookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicle = (searchParams.get("vehicle") || "").toLowerCase();
  const pack = (searchParams.get("pack") || "") as PackageKey;
  const basePrice = Number(searchParams.get("basePrice") || "0");
  const finalPrice = Number(searchParams.get("finalPrice") || "0");
  const offerActive = searchParams.get("offerActive") === "1";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [notes, setNotes] = useState("");

  const packageLabel = useMemo(() => {
    const map: Record<string, string> = {
      cinematic: "Cinematic Shots",
      rolling: "Rolling Shots",
      combo: "Combo (Cinematic + Rolling)",
      delivery: "New Vehicle Delivery",
    };
    return map[pack] || pack;
  }, [pack]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!vehicle || !pack || !finalPrice) {
      router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, [router, vehicle, pack, finalPrice]);

  const validate = () => {
    if (!fullName.trim()) return "Please enter your full name.";
    if (!/^\d{10}$/.test(phone)) return "Enter a valid 10-digit mobile number.";
    if (!city.trim()) return "Please enter your city.";
    if (!vehicleModel.trim()) return "Please enter vehicle model.";
    return "";
  };

  const submitBooking = async () => {
    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "bookings"), {
        uid: user.uid,
        email: user.email || "",
        createdAt: serverTimestamp(),

        vehicle,
        pack,
        packageLabel,
        basePrice,
        finalPrice,
        offerApplied: offerActive,

        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        vehicleModel: vehicleModel.trim(),
        notes: notes.trim(),

        bookingStatus: "new",
        paymentStatus: "pending",
      });

      router.push(`/checkout?bookingId=${docRef.id}`);
    } catch (e: any) {
      setError(e?.message || "Failed to save booking.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* Top Bar */}
      <div className="absolute top-6 left-6 flex items-center gap-6">
        <img
          src="/charanstorycuts-logo.png"
          alt="Logo"
          className="h-8"
        />
        <button
          onClick={() => router.back()}
          className="text-sm text-white/60 hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-10">

        <h1 className="text-4xl font-semibold">Booking Details</h1>
        <p className="text-white/60 mt-2">
          Fill this once. We’ll handle the rest.
        </p>

        {/* Summary Card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-sm text-white/50">Selected package</div>
          <div className="mt-2 text-xl font-semibold">
            {vehicle.toUpperCase()} — {packageLabel}
          </div>

          <div className="mt-6 flex justify-between items-end">
            <div>
              <div className="text-sm text-white/50">Payable</div>
              <div className="text-4xl font-semibold text-white">
                ₹{finalPrice}
              </div>
              {offerActive && (
                <div className="text-xs text-white/40 mt-1">
                  Offer applied (original ₹{basePrice})
                </div>
              )}
            </div>
            <div className="text-sm text-white/40">
              Editing included
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Full Name *
              </label>
              <input
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Mobile Number *
              </label>
              <input
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                City *
              </label>
              <input
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* Vehicle Model */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Vehicle Model *
              </label>
              <input
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
            </div>

            {/* Ideas */}
            <div className="md:col-span-2">
              <label className="block text-sm text-white/60 mb-2">
                Type your ideas or requirements (optional)
              </label>
              <textarea
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 min-h-[120px] focus:outline-none focus:border-white transition"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 text-sm text-red-400">{error}</div>
          )}

          <button
            onClick={submitBooking}
            disabled={saving}
            className="mt-8 w-full bg-white text-black py-4 rounded-full font-medium hover:scale-105 transition cursor-pointer"
          >
            {saving ? "Saving..." : "Continue to Payment →"}
          </button>
        </div>

        {/* Premium Reassurance Text */}
        <div className="mt-12 text-center text-white/40 italic text-sm">
          You won't regret paying charanstorycuts. 
          Quality and experience that’s worth every penny. 
          We can’t wait to create magic with your machine!
        </div>

      </div>
    </div>
  );
}
