"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // ===== ABOUT SECTION STATE START =====
  const [openAbout, setOpenAbout] = useState(false);
  // ===== ABOUT SECTION STATE END =====

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
          Cinematic edits. Clean stories. Crafted to make your machine stand out.  
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleBook}
          className="mt-10 bg-white text-black px-8 py-4 rounded-full font-medium transition cursor-pointer shadow-lg hover:shadow-yellow-500/30"
        >
          Get your first shoot for{""}
          <span className="ml-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold shadow-sm">
            ₹500
          </span>
        </motion.button>

        {/* Limited Offer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-3 text-white/70 max-w-xl text-sm italic"
        >
          ⚡Limited time Offer - Book now and save big!⚡
        </motion.p>
      </section>

     {/* Our Work */}
      <section className="mt-28 px-8">
        <h2 className="text-2xl font-semibold mb-8">Our Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bike Shoots */}
          <a
            href="https://www.instagram.com/reel/DO8zp3cDw8j/"
            target="_blank"
            className="group cursor-pointer relative rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src="/bike.jpg"
              alt="Bike cinematic videography in Hyderabad"
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
              alt="Car cinematic videography in Hyderabad"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div className="text-lg font-semibold">Car Shoots</div>
            </div>
          </a>

          {/* Cinematic Reels */}
          <a
            href="https://www.instagram.com/reel/DT0dmolDwwQ/"
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

      {/* ===== FLOATING ABOUT BUTTON (NEW POSITION) ===== */}
<div className="fixed bottom-5 right-5 z-40">
  <button
    onClick={() => setOpenAbout(true)}
    className="group flex items-center justify-start bg-[#111] border border-white/20 hover:border-white/40 w-12 h-12 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer hover:w-44 overflow-hidden cursor-pointer pl-3"
  >
    <span className="text-base flex-shrink-0">ℹ️</span>

    <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap text-sm text-white/80 transition">
      About Us
    </span>
  </button>
</div>


      {/* ===== END FLOATING ABOUT BUTTON ===== */}

      {/* Social Links */}
      <section className="mt-12 px-8 text-center">
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

      {/* ABOUT MODAL (UNCHANGED) */}
      {openAbout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpenAbout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] text-white w-[90%] max-w-md rounded-2xl p-6 relative max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={() => setOpenAbout(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center gap-6">

  {/* Profile */}
  <div className="relative">
    <div className="absolute inset-0 blur-xl bg-yellow-500/20 rounded-full"></div>
    <img
      src="/charan.jpg"
      alt="Sai Charan Gokam"
      className="relative w-24 h-24 rounded-full object-cover border border-gray-600"
    />
  </div>

  <div>
    <h2 className="text-xl font-semibold tracking-wide">Sai Charan Gokam</h2>
    <p className="text-xs text-gray-500">
      Founder • CharanStorycuts
    </p>
  </div>

  <div className="w-12 h-[2px] bg-yellow-500 rounded"></div>

  {/* Description */}
  <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
    At CharanStorycuts, we create cinematic visuals that highlight the true
    personality of your vehicle. Our goal is to deliver powerful,
    clean and professional automotive storytelling.
  </p>

  {/* Services */}
  <div className="w-full text-left mt-2">
    <p className="font-semibold text-white mb-2">Our Services</p>

    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
      <div>🎬 Cinematic Shots</div>
      <div>🏍 Rolling Shots</div>
      <div>🔥 Combo (Cinematic + Rolling)</div>
      <div>🚗 New Vehicle Delivery</div>
    </div>
  </div>

  {/* Equipment */}
  <div className="w-full text-left">
    <p className="font-semibold text-white mb-2">Equipment We Use</p>

    <div className="space-y-1 text-sm text-gray-400">
      <div>📱 iPhone 16 Pro Max</div>
      <div>🎥 DJI Osmo Mobile 7 (Gimbal)</div>
    </div>
  </div>

  {/* Contact */}
  <div className="w-full text-left text-sm text-gray-300 space-y-1 mt-2">
    <p className="font-semibold text-white mb-2">Contact Information</p>
    <p>📱 +91 7730823301</p>
    <p>📧 charanstorycuts@gmail.com</p>
    <p>📍 Hyderabad</p>
  </div>

  {/* Book Button */}
  <button
    onClick={handleBook}
    className="mt-3 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition shadow-lg hover:shadow-yellow-500/30 cursor-pointer"
  >
    Book Your Shoot
  </button>

</div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 px-8 pb-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} charanstorycuts. All rights reserved.
      </footer>
    </div>
  );
}
