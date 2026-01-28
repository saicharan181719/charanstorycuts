"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/user";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // If already logged in → go to dashboard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/dashboard");
    });
    return () => unsub();
  }, [router]);

  const handleEmailAuth = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      // ✅ Create user profile in Firestore (for ₹9 first-time offer)
      if (auth.currentUser) {
        await ensureUserProfile(auth.currentUser);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);

      // ✅ Create user profile in Firestore (for ₹9 first-time offer)
      if (auth.currentUser) {
        await ensureUserProfile(auth.currentUser);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-wide">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {isSignup
              ? "Sign up to book your first shoot for ₹9."
              : "Login to continue booking your shoot."}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email */}
        <label className="text-xs text-white/60">Email</label>
        <input
          className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-xs text-white/60 mt-4 block">Password</label>
        <input
          className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Action */}
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="mt-5 w-full rounded-xl border border-white/20 py-3 font-medium hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
        </button>

        {/* Toggle */}
        <div className="mt-6 text-sm text-white/60">
          {isSignup ? "Already have an account?" : "New to charanstorycuts?"}{" "}
          <button
            onClick={() => {
              setError("");
              setIsSignup(!isSignup);
            }}
            className="text-white underline underline-offset-4 hover:opacity-80"
            type="button"
          >
            {isSignup ? "Login" : "Create account"}
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-white/40">
          By continuing, you agree to basic terms of service.
        </p>
      </div>
    </div>
  );
}
