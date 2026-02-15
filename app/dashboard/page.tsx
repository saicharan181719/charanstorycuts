"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserEmail(user.email);
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const goToPackages = (vehicle: string) => {
    router.push(`/packages/${vehicle}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans px-8">

      {/* Top Bar */}
      <div className="flex items-center justify-between py-6">
        <img
          src="/charanstorycuts-logo.png"
          alt="logo"
          className="h-10 cursor-pointer"
          onClick={() => router.push("/")}
        />

        <button
          onClick={handleLogout}
          className="border border-white/30 px-5 py-2 rounded-full hover:bg-white hover:text-black transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Hero Section */}
      <section className="mt-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Book your shoot <span className="text-red-500">now</span>
        </h1>

        <p className="mt-4 text-white/60 text-lg">
          Choose your vehicle and confirm your booking in seconds.
        </p>

        {userEmail && (
          <p className="mt-2 text-sm text-white/40">
            Signed in as {userEmail}
          </p>
        )}
      </section>

      {/* Vehicle Section */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-10">
          Choose your vehicle
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Bike Card */}
          <div
            onClick={() => goToPackages("bike")}
            className="bg-white text-black rounded-2xl p-8 cursor-pointer hover:scale-[1.03] transition duration-300 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Bike Shoots</h3>
              <span className="text-xl">→</span>
            </div>

            <p className="mt-4 text-black/70">
              Dynamic cinematic bike shoots crafted for reels.
            </p>
          </div>

          {/* Car Card */}
          <div
            onClick={() => goToPackages("car")}
            className="bg-white text-black rounded-2xl p-8 cursor-pointer hover:scale-[1.03] transition duration-300 shadow-lg"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Car Shoots</h3>
              <span className="text-xl">→</span>
            </div>

            <p className="mt-4 text-black/70">
              Premium cinematic car visuals with clean motion.
            </p>
          </div>

        </div>
      </section>

      {/* Cinematic Brand Statement */}
      <section className="mt-28 text-center px-6 pb-24">
        <div className="max-w-3xl mx-auto">

          <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            Basic edits are everywhere.
            <br />
            <span className="text-red-500">Cinematic excellence</span> isn’t.
          </h2>

          <p className="mt-6 text-white/60 text-lg md:text-xl">
            CharanStoryCuts creates visuals that feel like cinema —
            clean storytelling, premium motion, zero compromise.
          </p>

        </div>
      </section>

    </div>
  );
}
