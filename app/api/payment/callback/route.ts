import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * Payment callback webhook handler.
 * 
 * This is a skeleton for future AtijariPay integration.
 * When you get your credentials, you'll:
 * 1. Validate the signature/HMAC from AtijariPay
 * 2. Extract the order/booking ID and payment status
 * 3. Update the booking's payment_status accordingly
 * 
 * AtijariPay typically sends a POST with form data or JSON
 * containing: order_id, status, amount, signature, etc.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // TODO: Replace with actual AtijariPay signature validation
        // const signature = request.headers.get("x-attijaripay-signature");
        // const isValid = validateSignature(body, signature, ATTIJARIPAY_SECRET);
        // if (!isValid) {
        //     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        // }

        const { order_id, status } = body;

        if (!order_id || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Map AtijariPay status to our payment_status
        const paymentStatus = status === "success" ? "paid" : "failed";

        const { error } = await supabase
            .from("bookings")
            .update({ payment_status: paymentStatus })
            .eq("id", order_id);

        if (error) {
            console.error("Payment callback DB error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Payment callback error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
