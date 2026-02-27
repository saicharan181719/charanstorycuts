import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // ✅ Update booking
    await adminDb.collection("bookings").doc(bookingId).update({
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      paymentId: razorpay_payment_id,
    });

    // ✅ Fetch full booking details
    const bookingSnap = await adminDb
      .collection("bookings")
      .doc(bookingId)
      .get();

    const booking = bookingSnap.data();

    if (!booking) {
      return NextResponse.json({ success: true });
    }

    const {
      fullName,
      email,
      mobile,
      vehicleModel,
      pack,
      city,
      finalPrice,
    } = booking;

    // ==============================
    // 📧 CUSTOMER EMAIL
    // ==============================

    await resend.emails.send({
      from: "CharanStoryCuts <onboarding@resend.dev>",
      to: email,
      subject: "🎉 Booking Confirmed – CharanStoryCuts",
      html: `
        <h2>Payment Successful 🎉</h2>
        <p>Hi ${fullName},</p>
        <p>Your booking has been confirmed successfully.</p>
        <hr />
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Package:</strong> ${pack}</p>
        <p><strong>Vehicle:</strong> ${vehicleModel}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Amount Paid:</strong> ₹${finalPrice}</p>
        <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
        <hr />
        <p>We will contact you shortly for further coordination.</p>
        <p>— CharanStoryCuts</p>
      `,
    });

    // ==============================
    // 📧 ADMIN EMAIL
    // ==============================

    await resend.emails.send({
      from: "CharanStoryCuts <onboarding@resend.dev>",
      to: "charanstorycuts@gmail.com", // 🔴 replace with your Gmail
      subject: "🚀 New Paid Booking Received",
      html: `
        <h2>New Booking Alert</h2>
        <hr />
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Vehicle:</strong> ${vehicleModel}</p>
        <p><strong>Package:</strong> ${pack}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Amount:</strong> ₹${finalPrice}</p>
        <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}