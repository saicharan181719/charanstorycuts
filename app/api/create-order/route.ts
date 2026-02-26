import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID missing" },
        { status: 400 }
      );
    }

    // 🔥 Fetch booking from Firestore
    const bookingDoc = await adminDb
      .collection("bookings")
      .doc(bookingId)
      .get();

    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = bookingDoc.data();

    const finalPrice = bookingData?.finalPrice;

    if (!finalPrice) {
      return NextResponse.json(
        { error: "Invalid booking amount" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: finalPrice * 100, // convert to paise
      currency: "INR",
      receipt: bookingId,
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}