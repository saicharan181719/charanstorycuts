"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type PackageKey = "cinematic" | "rolling" | "combo" | "delivery";

export default function BookingPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // Coming from Packages page
  const vehicle = (sp.get("vehicle") || "").toLowerCase(); // bike / car
  const pack = (sp.get("pack") || "") as PackageKey;
  const basePrice = Number(sp.get("basePrice") || "0");
  const finalPrice = Number(sp.get("finalPrice") || "0");
  const offerActive = sp.get("offerActive") === "1";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [time, setTime] = useState(""); // hh:mm
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
    // Basic guard checks + auth check
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
    if (!/^\d{10}$/.test(phone.trim()))
      return "Please enter a valid 10-digit mobile number.";
    if (!city.trim()) return "Please enter your city.";
    if (!location.trim()) return "Please enter shoot location / area.";
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

        // Package
        vehicle, // "bike" | "car"
        pack, // cinematic | rolling | combo | delivery
        packageLabel,
        basePrice,
        finalPrice,
        offerApplied: offerActive,

        // Booking details
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        location: location.trim(),
        vehicleModel: vehicleModel.trim(),
        date, // yyyy-mm-dd
        time, // hh:mm
        notes: notes.trim(),

        // Status for next steps
        paymentStatus: "pending",
        bookingStatus: "new",
      });

      // Go to checkout with bookingId
      router.push(`/checkout?bookingId=${docRef.id}`);
    } catch (e: any) {
      setError(e?.message || "Failed to save booking. Please try again.");
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
          className="text-sm text-white/70 hover:text-white transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold mt-4">Booking Details</h1>
        <p className="text-white/60 mt-2 text-sm">
          Fill this once. We’ll use it to confirm your shoot.
        </p>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Selected package</div>
          <div className="mt-2 text-lg font-semibold">
            {vehicle.toUpperCase()} — {packageLabel}
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-sm text-white/60">Payable</div>
              <div className="text-3xl font-semibold mt-1">₹{finalPrice}</div>
              {offerActive && (
                <div className="text-xs text-white/40 mt-1">
                  Offer applied (original{" "}
                  <span className="line-through">₹{basePrice}</span>)
                </div>
              )}
            </div>

            <div className="text-xs text-white/40 text-right">
              Editing included
              <br />
              Booking confirmation after payment
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60">Full Name</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-xs text-white/60">Mobile Number</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit number"
              />
            </div>

            <div>
              <label className="text-xs text-white/60">City</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Hyderabad"
              />
            </div>

            <div>
              <label className="text-xs text-white/60">Vehicle Model</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder={vehicle === "car" ? "Creta / i20 / Swift..." : "R15 / Duke / RE..."}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-white/60">Shoot Location / Area</label>
              <input
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Gachibowli / Jubilee Hills / ORR..."
              />
            </div>

            <div>
              <label className="text-xs text-white/60">Date</label>
              <input
                type="date"
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-white/60">Time</label>
              <input
                type="time"
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-white/60">Notes (optional)</label>
              <textarea
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special request? (Example: include number plate shot, slow-motion, etc.)"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={submitBooking}
            disabled={saving}
            className="mt-6 w-full bg-white text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Continue to Payment →"}
          </button>

          <p className="mt-3 text-xs text-white/40">
            Your booking details will be saved securely. Payment is the next step.
          </p>
        </div>
      </div>
    </div>
  );
}
