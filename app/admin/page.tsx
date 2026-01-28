"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

type Booking = {
  id: string;
  createdAt?: any;
  bookingStatus?: string; // new / confirmed / completed / cancelled
  paymentStatus?: string; // pending / paid
  uid?: string;
  email?: string;

  vehicle?: string;
  pack?: string;
  packageLabel?: string;
  basePrice?: number;
  finalPrice?: number;
  offerApplied?: boolean;

  fullName?: string;
  phone?: string;
  city?: string;
  location?: string;
  vehicleModel?: string;
  date?: string;
  time?: string;
  notes?: string;
};

const ADMIN_EMAIL = "charanstorycuts@gmail.com";

function fmtTime(ts: any) {
  try {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function AdminPage() {
  const router = useRouter();

  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }

      // ✅ Admin email gate
      if ((u.email || "").toLowerCase() !== ADMIN_EMAIL) {
        router.replace("/dashboard");
        return;
      }

      setMe(u);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!me) return;

    setError("");

    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: Booking[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setBookings(rows);
      },
      (err) => setError(err.message || "Failed to load bookings.")
    );

    return () => unsub();
  }, [me]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.paymentStatus !== "paid").length;
    const paid = bookings.filter((b) => b.paymentStatus === "paid").length;
    const confirmed = bookings.filter((b) => b.bookingStatus === "confirmed").length;
    return { total, pending, paid, confirmed };
  }, [bookings]);

  const setStatus = async (id: string, bookingStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { bookingStatus });
    } catch (e: any) {
      alert(e?.message || "Failed to update status.");
    }
  };

  const markPaid = async (id: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { paymentStatus: "paid" });
    } catch (e: any) {
      alert(e?.message || "Failed to update payment.");
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-white/60 mt-2 text-sm">
              View and manage bookings for CharanStoryCuts.
            </p>
            <p className="text-white/40 mt-1 text-xs">
              Admin: <span className="text-white/70">{me?.email}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/50">Total</div>
            <div className="text-2xl font-semibold mt-1">{stats.total}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/50">Pending Payment</div>
            <div className="text-2xl font-semibold mt-1">{stats.pending}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/50">Paid</div>
            <div className="text-2xl font-semibold mt-1">{stats.paid}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-white/50">Confirmed</div>
            <div className="text-2xl font-semibold mt-1">{stats.confirmed}</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Bookings list */}
        <div className="mt-8 space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/60">
              No bookings yet.
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="text-xs text-white/50">
                      {fmtTime(b.createdAt)}
                    </div>
                    <div className="text-xl font-semibold mt-1">
                      {b.fullName || "Customer"} •{" "}
                      <span className="text-white/70">{b.phone}</span>
                    </div>

                    <div className="text-sm text-white/60 mt-2">
                      {String(b.vehicle || "").toUpperCase()} —{" "}
                      {b.packageLabel || b.pack} •{" "}
                      <span className="text-white">₹{b.finalPrice}</span>
                      {b.offerApplied && (
                        <span className="text-white/40">
                          {" "}
                          (offer applied)
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-white/60 mt-1">
                      {b.city} • {b.location} • {b.vehicleModel}
                    </div>

                    <div className="text-sm text-white/60 mt-1">
                      Shoot:{" "}
                      <span className="text-white/80">
                        {b.date} {b.time}
                      </span>
                    </div>

                    {b.notes && (
                      <div className="text-sm text-white/50 mt-2">
                        Notes: {b.notes}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                        Payment: {b.paymentStatus || "pending"}
                      </span>
                      <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/70">
                        Status: {b.bookingStatus || "new"}
                      </span>
                      <span className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/50">
                        {b.email}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 md:min-w-[220px]">
                    <button
                      onClick={() => markPaid(b.id)}
                      className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black transition"
                    >
                      Mark Paid
                    </button>

                    <button
                      onClick={() => setStatus(b.id, "confirmed")}
                      className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black transition"
                    >
                      Confirm Booking
                    </button>

                    <button
                      onClick={() => setStatus(b.id, "completed")}
                      className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black transition"
                    >
                      Mark Completed
                    </button>

                    <button
                      onClick={() => setStatus(b.id, "cancelled")}
                      className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 text-xs text-white/40">
          Tip: Add this page link to your own bookmark: <span className="text-white/60">/admin</span>
        </div>
      </div>
    </div>
  );
}
