"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async () => {
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError("Authentication failed. Check details.");
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img
          src="/charanstorycuts-logo.png"
          alt="charanstorycuts"
          className="h-9 cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
        >
          <h1 className="text-2xl font-semibold text-center">
            {isSignup ? "Create Account" : "Login to"}{" "}
            <span className="text-white">charanstorycuts</span>
          </h1>

          <p className="text-sm text-white/60 text-center mt-2">
            {isSignup
              ? "Start booking your shoot"
              : "Continue booking your shoot"}
          </p>

          {/* Google */}
          <button
            onClick={loginGoogle}
            className="mt-6 w-full bg-white text-black py-3 rounded-full font-medium hover:scale-[1.02] transition cursor-pointer"
          >
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-6 gap-4 text-white/30 text-xs">
            <div className="flex-1 h-px bg-white/10" />
            OR
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email + Password */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 pr-12 outline-none focus:border-white/30 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
              >
                {showPassword ? "⌣" : "👁"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleEmailAuth}
            disabled={loading}
            className="mt-6 w-full border border-white/20 py-3 rounded-full hover:bg-white hover:text-black transition cursor-pointer disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>

          {/* Toggle */}
          <p className="mt-5 text-sm text-center text-white/60">
            {isSignup ? "Already have an account?" : "New to charanstorycuts?"}{" "}
            <span
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="underline cursor-pointer hover:text-white"
            >
              {isSignup ? "Login" : "Create account"}
            </span>
          </p>

          <p className="mt-4 text-xs text-white/30 text-center">
            By continuing, you agree to basic terms of service.
          </p>
        </motion.div>
      </div>
    </div>
  );
}