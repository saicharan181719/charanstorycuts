"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type PackageKey = "cinematic" | "rolling" | "combo" | "delivery";

export default function BookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Params from packages page
  const vehicle = (searchParams.get("vehicle") || "").toLowerCase();
  const pack = (searchParams.get("pack") || "") as PackageKey;
  const basePrice = Number(searchParams.get("basePrice") || "0");
  const finalPrice = Number(searchParams.get("finalPrice") || "0");
  const offerActive = searchParams.get("offerActive") === "1";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
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
    if (!location.trim()) return "Please enter shoot location.";
    if (!vehicleModel.trim()) return "Please enter vehicle model.";
    if (!date) return "Please select a date.";
    if (!time) return "Please select a time.";
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
        location: location.trim(),
        vehicleModel: vehicleModel.trim(),
        date,
        time,
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
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-sm text-white/70 hover:text-white"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold mt-4">Booking Details</h1>
        <p className="text-white/60 mt-2 text-sm">
          Fill this once. We’ll handle the rest.
        </p>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Selected package</div>
          <div className="mt-2 text-lg font-semibold">
            {vehicle.toUpperCase()} — {packageLabel}
          </div>

          <div className="mt-4 flex justify-between items-end">
            <div>
              <div className="text-sm text-white/60">Payable</div>
              <div className="text-3xl font-semibold">₹{finalPrice}</div>
              {offerActive && (
                <div className="text-xs text-white/40 mt-1">
                  Offer applied (original ₹{basePrice})
                </div>
              )}
            </div>
            <div className="text-xs text-white/40 text-right">
              Editing included
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
            <input
              className="input"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="input"
              placeholder="Vehicle Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
            />
            <input
              className="input md:col-span-2"
              placeholder="Shoot Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              className="input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <textarea
              className="input md:col-span-2 min-h-[100px]"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-300">{error}</div>
          )}

          <button
            onClick={submitBooking}
            disabled={saving}
            className="mt-6 w-full bg-white text-black py-3 rounded-full font-medium hover:scale-105 transition"
          >
            {saving ? "Saving..." : "Continue to Payment →"}
          </button>
        </div>
      </div>
    </div>
  );
}
