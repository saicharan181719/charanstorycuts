"use client";

import { motion } from "framer-motion";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
      {/* Logo */}
      <motion.img
        src="/charanstorycuts-logo.png"
        alt="CharanStoryCuts"
        className="h-12 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Spinner */}
      <motion.div
        className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      <p className="mt-6 text-sm text-white/60">
        Loading, please wait…
      </p>
    </div>
  );
}
