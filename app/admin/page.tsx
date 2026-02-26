"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  fullName: string;
  mobile?: string;
  vehicleModel?: string;
  pack?: string;
  city?: string;
  finalPrice?: number;
  createdAt?: any;
  paymentId?: string;
};

export default function AdminView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(
        collection(db, "bookings"),
        where("paymentStatus", "==", "paid"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data: Booking[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings(data);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <img
          src="/charanstorycuts-logo.png"
          alt="Logo"
          className="h-8 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />

        <button
          onClick={handleLogout}
          className="border border-white/30 px-5 py-2 rounded-full text-sm hover:bg-white hover:text-black transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-semibold mb-10">
        Paid Bookings
      </h1>

      {loading ? (
        <p className="text-white/60">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-white/60">No paid bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="grid md:grid-cols-2 gap-6 text-sm">

                <div>
                  <p className="text-white/50">Name</p>
                  <p className="font-medium">{booking.fullName}</p>
                </div>

                <div>
                  <p className="text-white/50">Mobile</p>
                  <p>{booking.mobile}</p>
                </div>

                <div>
                  <p className="text-white/50">Vehicle</p>
                  <p>{booking.vehicleModel}</p>
                </div>

                <div>
                  <p className="text-white/50">Package</p>
                  <p>{booking.pack}</p>
                </div>

                <div>
                  <p className="text-white/50">City</p>
                  <p>{booking.city}</p>
                </div>

                <div>
                  <p className="text-white/50">Amount Paid</p>
                  <p className="text-green-400 font-semibold">
                    ₹ {booking.finalPrice}
                  </p>
                </div>

                <div>
                  <p className="text-white/50">Payment ID</p>
                  <p className="text-white/80 text-xs break-all">
                    {booking.paymentId}
                  </p>
                </div>

                <div>
                  <p className="text-white/50">Booked On</p>
                  <p>
                    {booking.createdAt?.toDate
                      ? booking.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}