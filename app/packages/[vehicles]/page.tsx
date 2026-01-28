"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  CameraIcon,
  RollIcon,
  ComboIcon,
  DeliveryIcon,
} from "@/app/components/icons";

type Vehicle = "bike" | "car";
type PackageKey = "cinematic" | "rolling" | "combo" | "delivery";

const BIKE_PRICES: Record<PackageKey, number> = {
  cinematic: 499,
  rolling: 599,
  combo: 999,
  delivery: 759, // New Bike Delivery
};

const CAR_PRICES: Record<PackageKey, number> = {
  cinematic: 699,
  rolling: 799,
  combo: 1299,
  delivery: 1159, // New Car Delivery
};

const TITLES: Record<PackageKey, string> = {
  cinematic: "Cinematic Shots",
  rolling: "Rolling Shots",
  combo: "Combo (Cinematic + Rolling)",
  delivery: "New Vehicle Delivery",
};

const DETAILS: Record<PackageKey, string> = {
  cinematic:
    "We will shoot cinematic shots with clean framing and smooth movements.",
  rolling:
    "We will shoot rolling shots with stable tracking and dynamic angles.",
  combo:
    "We will shoot both cinematic reels and rolling shots for a complete output.",
  delivery:
    "Perfect for delivery shoots with a premium reveal style and highlights.",
};

function PackageIcon({ type }: { type: PackageKey }) {
  if (type === "cinematic") return <CameraIcon className="w-5 h-5 text-white/80" />;
  if (type === "rolling") return <RollIcon className="w-5 h-5 text-white/80" />;
  if (type === "combo") return <ComboIcon className="w-5 h-5 text-white/80" />;
  return <DeliveryIcon className="w-5 h-5 text-white/80" />;
}

export default function PackagesPage() {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Vehicle derived from URL (super reliable)
  const vehicle: Vehicle = useMemo(() => {
    const last = (pathname || "").split("/").filter(Boolean).pop();
    return last === "car" ? "car" : "bike";
  }, [pathname]);

  const vehicleLabel = vehicle === "car" ? "Car" : "Bike";
  const prices = vehicle === "car" ? CAR_PRICES : BIKE_PRICES;

  const [selected, setSelected] = useState<PackageKey>("cinematic");
  const [offerActive, setOfferActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Load offerUsed from Firestore
  useEffect(() => {
    const run = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      const offerUsed = snap.exists() ? !!snap.data().offerUsed : true;
      setOfferActive(!offerUsed);
      setLoading(false);
    };

    run();
  }, [router]);

  // ✅ reset selected package on vehicle switch (optional but good UX)
  useEffect(() => {
    setSelected("cinematic");
  }, [vehicle]);

  const basePrice = prices[selected];
  const finalPrice = offerActive ? 9 : basePrice;

  const proceed = () => {
    const qs = new URLSearchParams({
      vehicle,
      pack: selected,
      basePrice: String(basePrice),
      finalPrice: String(finalPrice),
      offerActive: offerActive ? "1" : "0",
    }).toString();

    router.push(`/booking?${qs}`);

  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-white/70 hover:text-white transition"
        >
          ← Back
        </button>

        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold">{vehicleLabel} Packages</h1>
            <p className="text-white/60 mt-2 text-sm">
              All packages include editing.
            </p>
          </div>

          {offerActive && (
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              🎉 First-time offer: ₹9
            </div>
          )}
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {(["cinematic", "rolling", "combo", "delivery"] as PackageKey[]).map(
            (key) => {
              const active = selected === key;
              const shownPrice = offerActive ? 9 : prices[key];

              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={[
                    "rounded-2xl border p-5 text-left transition",
                    active
                      ? "border-white/40 bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  {/* ✅ Icon + Title */}
                  <div className="flex items-center gap-2">
                    <PackageIcon type={key} />
                    <div className="text-lg font-semibold">
                      {key === "delivery"
                        ? `New ${vehicleLabel} Delivery`
                        : TITLES[key]}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-white/60">
                    Price:{" "}
                    <span className="text-white font-semibold">
                      ₹{shownPrice}
                    </span>
                    {offerActive && (
                      <span className="ml-2 line-through text-white/30">
                        ₹{prices[key]}
                      </span>
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* Details */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <PackageIcon type={selected} />
                <h2 className="text-xl font-semibold">
                  {selected === "delivery"
                    ? `New ${vehicleLabel} Delivery`
                    : TITLES[selected]}
                </h2>
              </div>

              <p className="mt-3 text-white/70">{DETAILS[selected]}</p>
              <p className="mt-3 text-white/70">✅ Editing included</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-white/60">Total</div>
              <div className="text-3xl font-semibold mt-1">₹{finalPrice}</div>

              <button
                onClick={proceed}
                className="mt-4 bg-white text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
