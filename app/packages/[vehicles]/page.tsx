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
  delivery: 759,
};

const CAR_PRICES: Record<PackageKey, number> = {
  cinematic: 699,
  rolling: 799,
  combo: 1299,
  delivery: 1159,
};

const TITLES: Record<PackageKey, string> = {
  cinematic: "Cinematic Shots",
  rolling: "Rolling Shots",
  combo: "Combo (Cinematic + Rolling)",
  delivery: "New Vehicle Delivery",
};

const DETAILS: Record<PackageKey, string> = {
  cinematic:
    "Clean cinematic framing with smooth camera movements and premium output.",
  rolling:
    "Dynamic rolling shots with stable tracking and professional motion.",
  combo:
    "Complete cinematic + rolling experience crafted for standout content.",
  delivery:
    "Premium delivery reveal with highlights and stylish presentation.",
};

function PackageIcon({ type }: { type: PackageKey }) {
  const baseClass = "w-5 h-5";
  if (type === "cinematic") return <CameraIcon className={baseClass} />;
  if (type === "rolling") return <RollIcon className={baseClass} />;
  if (type === "combo") return <ComboIcon className={baseClass} />;
  return <DeliveryIcon className={baseClass} />;
}

export default function PackagesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const vehicle: Vehicle = useMemo(() => {
    const last = (pathname || "").split("/").filter(Boolean).pop();
    return last === "car" ? "car" : "bike";
  }, [pathname]);

  const vehicleLabel = vehicle === "car" ? "Car" : "Bike";
  const prices = vehicle === "car" ? CAR_PRICES : BIKE_PRICES;

  const [selected, setSelected] = useState<PackageKey>("cinematic");
  const [offerActive, setOfferActive] = useState(false);
  const [loading, setLoading] = useState(true);

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

      {/* LOGO */}
      <div className="absolute top-6 left-6">
        <img
          src="/charanstorycuts-logo.png"
          alt="Logo"
          className="h-8 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />
      </div>

      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-white/60 hover:text-white transition mb-4"
        >
          ← Back
        </button>

        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold">
              {vehicleLabel} Packages
            </h1>
            <p className="text-white/50 mt-2 text-sm">
              Premium packages. Clean execution. No compromises.
            </p>
          </div>

          {offerActive && (
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              🎉 First-time offer: ₹9
            </div>
          )}
        </div>

        {/* PACKAGE BUTTONS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {(["cinematic", "rolling", "combo", "delivery"] as PackageKey[]).map(
            (key) => {
              const active = selected === key;
              const shownPrice = offerActive ? 9 : prices[key];

              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={[
                    "rounded-2xl p-6 text-left transition cursor-pointer",
                    active
                      ? "bg-white text-black shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <PackageIcon type={key} />
                    {key === "delivery"
                      ? `New ${vehicleLabel} Delivery`
                      : TITLES[key]}
                  </div>

                  <div className="mt-3 text-sm opacity-80">
                    ₹{shownPrice}
                    {offerActive && (
                      <span className="ml-2 line-through opacity-50">
                        ₹{prices[key]}
                      </span>
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>

        {/* DETAILS CARD */}
        <div className="mt-12 rounded-2xl bg-white/5 border border-white/10 p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">
                {selected === "delivery"
                  ? `New ${vehicleLabel} Delivery`
                  : TITLES[selected]}
              </h2>

              <p className="text-white/70">{DETAILS[selected]}</p>
              <p className="mt-3 text-white/70">✅ Editing included</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-white/50">Total</div>
              <div className="text-3xl font-semibold mt-1">
                ₹{finalPrice}
              </div>

              <button
                onClick={proceed}
                className="mt-6 bg-white text-black px-8 py-3 rounded-full font-medium hover:scale-105 transition cursor-pointer"
              >
                Proceed to Payment →
              </button>
            </div>
          </div>
        </div>

        {/* PREMIUM ATTRACTIVE TEXT */}
        <div className="mt-16 text-center">
          <p className="text-white/60 italic text-sm max-w-2xl mx-auto">
            Every frame we shoot carries intention. Every rupee you invest
            returns in quality With <span className="text-white font-semibold">charanstorycuts</span> you’re not paying for a shoot — 
            you’re investing in what world sees you!
          </p>
        </div>

      </div>
    </div>
  );
}
