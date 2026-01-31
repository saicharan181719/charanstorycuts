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
          className="h-9"
        />

        <button
          onClick={goLogin}
          className="text-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition cursor-pointer"
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
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleBook}
          className="mt-10 bg-white text-black px-8 py-4 rounded-full font-medium transition cursor-pointer"
        >
          Get your first shoot for{" "}
          <span className="ml-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold shadow-sm">
            ₹9
          </span>
        </motion.button>
      </section>

     {/* Our Work */}
      <section className="mt-28 px-8">
        <h2 className="text-2xl font-semibold mb-8">Our Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bike Shoots */}
          <a
            href="https://www.instagram.com/reel/DLdryP5THe4/"
            target="_blank"
            className="group cursor-pointer relative rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src="/bike.jpg"
              alt="Bike Shoots"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div className="text-lg font-semibold">Bike Shoots</div>
            </div>
          </a>

          {/* Car Shoots */}
          <a
            href="https://www.instagram.com/reel/DRO6nn-Egt9/"
            target="_blank"
            className="group cursor-pointer relative rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src="/car.jpg"
              alt="Car Shoots"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div className="text-lg font-semibold">Car Shoots</div>
            </div>
          </a>

          {/* Cinematic Reels */}
          <a
            href="https://www.instagram.com/charanstorycuts/"
            target="_blank"
            className="group cursor-pointer relative rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src="/cinematic.jpg"
              alt="Cinematic Reels"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div className="text-lg font-semibold">Cinematic Reels</div>
            </div>
          </a>
        </div>
      </section>

      {/* Social Links */}
      <section className="mt-24 px-8 text-center">
        <h3 className="text-lg font-semibold mb-6">Follow our work</h3>

        <div className="flex justify-center gap-10">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/charanstorycuts/"
            target="_blank"
            className="flex items-center gap-2 text-white/70 hover:text-white transition cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17" cy="7" r="1.2" fill="currentColor"/>
            </svg>
            Instagram
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@charanstorycuts"
            target="_blank"
            className="flex items-center gap-2 text-white/70 hover:text-white transition cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="20" height="12" rx="4" stroke="currentColor" strokeWidth="2"/>
              <polygon points="10,9 16,12 10,15" fill="currentColor"/>
            </svg>
            YouTube
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 px-8 pb-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} charanstorycuts. All rights reserved.
      </footer>
    </div>
  );
}
