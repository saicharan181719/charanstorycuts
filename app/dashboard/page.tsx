"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { BikeIcon, CarIcon } from "@/app/components/icons";

const ADMIN_EMAIL = "charanstorycuts@gmail.com";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerActive, setOfferActive] = useState(false);

  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const offerUsed = snap.exists() ? !!snap.data().offerUsed : true;
        setOfferActive(!offerUsed);
      } catch {
        // If Firestore fails, don’t block the UI
        setOfferActive(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Book your shoot
            </h1>
            <p className="text-white/60 mt-2 text-sm">
              Choose a category, pick a package, and confirm your booking in
              seconds.
            </p>

            {/* ✅ Email + Admin badge */}
            <p className="text-white/40 mt-1 text-xs flex items-center gap-2 flex-wrap">
              <span>Signed in as</span>
              <span className="text-white/70">{user?.email}</span>

              {isAdmin && (
                <span className="text-[10px] rounded-full border border-white/20 bg-white/10 px-2 py-1 text-white/80">
                  Admin Mode
                </span>
              )}
            </p>
          </div>

          {/* ✅ Admin + Logout */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => router.push("/admin")}
                className="text-sm border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
              >
                Admin
              </button>
            )}

            <button
              onClick={handleLogout}
              className="text-sm border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Offer banner */}
        {offerActive && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-white/60">Welcome offer</div>
                <div className="text-xl font-semibold mt-1">
                  🎉 Your first shoot is just{" "}
                  <span className="text-white">₹9</span>
                </div>
                <p className="text-sm text-white/60 mt-2">
                  Pick any package below — the ₹9 offer will apply
                  automatically at checkout.
                </p>
              </div>

              <button
                onClick={() => router.push("/packages/bike")}
                className="bg-white text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition"
              >
                Start with Bike →
              </button>
            </div>
          </div>
        )}

        {/* Section title */}
        <div className="mt-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Choose your vehicle</h2>
            <p className="text-white/60 text-sm mt-1">
              We shoot both bikes and cars — cinematic, rolling shots, combo,
              and delivery.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Bike */}
          <button
            onClick={() => router.push("/packages/bike")}
            className="group text-left rounded-2xl border border-white/10 bg-white/5 p-7 hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/60">For Riders</div>

                <div className="flex items-center gap-3 mt-2">
                  <BikeIcon className="w-7 h-7 text-white/80" />
                  <div className="text-2xl font-semibold">Bike Shoots</div>
                </div>

                <p className="text-sm text-white/60 mt-3 max-w-md">
                  Crisp cinematic frames + dynamic rolling shots — crafted for
                  reels.
                </p>
              </div>

              <div className="text-white/50 group-hover:text-white transition text-xl">
                →
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Cinematic
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Rolling
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Combo
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                New Bike Delivery
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Editing Included
              </span>
            </div>
          </button>

          {/* Car */}
          <button
            onClick={() => router.push("/packages/car")}
            className="group text-left rounded-2xl border border-white/10 bg-white/5 p-7 hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white/60">For Drivers</div>

                <div className="flex items-center gap-3 mt-2">
                  <CarIcon className="w-7 h-7 text-white/80" />
                  <div className="text-2xl font-semibold">Car Shoots</div>
                </div>

                <p className="text-sm text-white/60 mt-3 max-w-md">
                  Premium angles, clean motion, and a polished cinematic look.
                </p>
              </div>

              <div className="text-white/50 group-hover:text-white transition text-xl">
                →
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Cinematic
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Rolling
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Combo
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                New Car Delivery
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                Editing Included
              </span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-white/40">
          Need something custom? We can also create a personalized package based
          on your idea.
        </div>
      </div>
    </div>
  );
}
