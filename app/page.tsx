"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => setReady(true));
    return () => unsub();
  }, []);

  const goLogin = () => router.push("/login");

  const handleBook = () => {
    const user = auth.currentUser;
    if (!user) router.push("/login");
    else router.push("/dashboard");
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <img
          src="/charanstorycuts-logo.png"
          alt="charanstorycuts logo"
          className="h-10"
        />

        <button
          onClick={goLogin}
          className="text-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-semibold tracking-wide"
        >
          Professional Editing & Videography
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mt-6 text-white/70 max-w-xl"
        >
          Cinematic edits. Clean stories. Crafted to make your moments unforgettable.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          onClick={handleBook}
          className="mt-10 bg-white text-black px-8 py-4 rounded-full font-medium hover:scale-105 transition"
        >
          Get your first shoot for ₹9
        </motion.button>
      </section>

      {/* Works */}
      <section className="mt-24 px-8">
        <h2 className="text-2xl font-semibold mb-6">Selected Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-video bg-white/5 rounded-2xl border border-white/10" />
          <div className="aspect-video bg-white/5 rounded-2xl border border-white/10" />
          <div className="aspect-video bg-white/5 rounded-2xl border border-white/10" />
        </div>

        <p className="mt-4 text-xs text-white/40">
          (Next: we’ll embed your Instagram reels here.)
        </p>
      </section>

      {/* Footer */}
      <footer className="fixed left-8 bottom-6 text-sm text-white/40">
        © {new Date().getFullYear()} charanstorycuts. All rights reserved.
      </footer>
    </div>
  );
}
