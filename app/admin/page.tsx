"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  fullName: string;
  phone?: string;
  vehicleModel?: string;
  pack?: string;
  city?: string;
  finalPrice?: number;
  createdAt?: any;
  paymentId?: string;
  notes?: string;
};

export default function AdminView() {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);

  const router = useRouter();

  /* -----------------------------
  LIVE BOOKINGS LISTENER
  ----------------------------- */

  useEffect(() => {

    const q = query(
      collection(db, "bookings"),
      where("paymentStatus", "==", "paid"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data: Booking[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings(data);
      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  /* -----------------------------
  LOGOUT
  ----------------------------- */

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  /* -----------------------------
  COPY PHONE
  ----------------------------- */

  const copyPhone = (phone?: string) => {

    if (!phone) return;

    navigator.clipboard.writeText(phone);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

  };

  /* -----------------------------
  DASHBOARD STATS
  ----------------------------- */

  const today = new Date().toDateString();

  const todayBookings = bookings.filter(
    (b) =>
      b.createdAt?.toDate &&
      b.createdAt.toDate().toDateString() === today
  );

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.finalPrice || 0),
    0
  );

  /* -----------------------------
  SEARCH
  ----------------------------- */

  const filteredBookings = bookings.filter((b) =>
    `${b.fullName} ${b.vehicleModel} ${b.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* -----------------------------
  GROUP BOOKINGS BY DATE
  ----------------------------- */

  const groupedBookings = filteredBookings.reduce(
    (groups: any, booking) => {

      const date = booking.createdAt?.toDate
        ? booking.createdAt.toDate().toLocaleDateString()
        : "Unknown";

      if (!groups[date]) groups[date] = [];

      groups[date].push(booking);

      return groups;

    },
    {}
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      {/* COPY POPUP */}

      {copied && (
        <div className="fixed top-6 right-6 bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
          Phone copied!
        </div>
      )}

      {/* TOP BAR */}

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

      {/* TITLE */}

      <h1 className="text-3xl font-semibold mb-8">
        Admin Dashboard
      </h1>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mb-12">

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/50 text-sm">Total Bookings</p>
          <p className="text-3xl font-semibold mt-2">
            {bookings.length}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/50 text-sm">Bookings Today</p>
          <p className="text-3xl font-semibold mt-2">
            {todayBookings.length}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/50 text-sm">Total Revenue</p>
          <p className="text-3xl font-semibold mt-2 text-green-400">
            ₹ {totalRevenue}
          </p>
        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-10">

        <input
          type="text"
          placeholder="Search name, vehicle or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none"
        />

      </div>

      {/* BOOKINGS */}

      {loading ? (
        <p className="text-white/60">Loading bookings...</p>
      ) : Object.keys(groupedBookings).length === 0 ? (
        <p className="text-white/60">No bookings found.</p>
      ) : (
        Object.entries(groupedBookings).map(([date, bookings]: any) => (

          <div key={date} className="mb-10">

            {/* DATE HEADER */}

            <h2 className="text-lg font-semibold mb-4 text-white/70">
              {date}
            </h2>

            <div className="space-y-6">

              {bookings.map((booking: Booking) => (

                <div
                  key={booking.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >

                  <div className="grid md:grid-cols-2 gap-6 text-sm">

                    <div>
                      <p className="text-white/50">Name</p>
                      <p className="font-medium">
                        {booking.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-white/50">Phone</p>

                      <div className="flex items-center gap-3">

                        <p>{booking.phone}</p>

                        <button
                          onClick={() => copyPhone(booking.phone)}
                          className="text-xs border border-white/20 px-2 py-1 rounded hover:bg-white hover:text-black transition cursor-pointer"
                        >
                          Copy
                        </button>

                      </div>

                    </div>

                    <div>
                      <p className="text-white/50">Vehicle</p>
                      <p>{booking.vehicleModel}</p>
                    </div>

                    <div>
                      <p className="text-white/50">Package</p>

                      <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs">
                        {booking.pack}
                      </span>

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

                      <p className="text-xs text-white/70 break-all">
                        {booking.paymentId}
                      </p>

                    </div>

                    <div>
                      <p className="text-white/50">Booked On</p>

                      <p>
                        {booking.createdAt?.toDate
                          ? booking.createdAt
                              .toDate()
                              .toLocaleString()
                          : "N/A"}
                      </p>

                    </div>

                  </div>

                  {/* ACTION BUTTON */}

                  <div className="flex gap-4 mt-6">

                    <a
                      href={`https://wa.me/91${booking.phone}`}
                      target="_blank"
                      className="text-sm bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-black font-medium cursor-pointer"
                    >
                      WhatsApp Client
                    </a>

                  </div>

                  {/* NOTES BUTTON */}

                  <div className="mt-6">
                    {booking.notes ? (
                      <button
                        onClick={() => setSelectedNotes(booking.notes || "")}
                        className="text-sm border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-black transition cursor-pointer"
                      >
                        Show Notes
                      </button>
                    ) : (
                      <p className="text-white/40 text-xs italic">
                        No notes provided
                      </p>
                    )}
                  </div>

                </div>

              ))}

            </div>

          </div>

        ))
      )}

      {/* NOTES POPUP */}

      {selectedNotes && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-black border border-white/20 rounded-2xl p-8 max-w-md w-full">

            <h2 className="text-xl font-semibold mb-4">
              Client Notes
            </h2>

            <p className="text-white/80 text-sm leading-relaxed">
              {selectedNotes}
            </p>

            <button
              onClick={() => setSelectedNotes(null)}
              className="mt-6 border border-white/30 px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition cursor-pointer"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}