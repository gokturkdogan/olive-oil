import { NextRequest, NextResponse } from "next/server";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { completeOrder } from "@/actions/orders";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;
    
    const baseUrl = process.env.NEXTAUTH_URL || `http://${request.headers.get("host") || "localhost:3000"}`;

    if (!token) {
      return NextResponse.redirect(new URL("/cart?error=invalid_payment", baseUrl));
    }

    // Verify payment with iyzico
    const paymentResult = await retrieveCheckoutForm(token);

    console.log("Payment Result Full:", paymentResult);

    if (paymentResult.status !== "success") {
      return NextResponse.redirect(new URL("/cart?error=payment_failed", baseUrl));
    }

    // Find order by token (payment_reference)
    const order = await db.order.findFirst({
      where: {
        payment_reference: token,
        status: "PENDING",
      },
    });

    if (!order) {
      console.error("Order not found for token:", token);
      return NextResponse.redirect(new URL("/cart?error=order_not_found", baseUrl));
    }

    const orderId = order.id;
    console.log("Order ID found:", orderId);
    
    // Complete order
    const result = await completeOrder(orderId, {
      status: paymentResult.paymentStatus === "SUCCESS" ? "success" : "failure",
      paymentId: paymentResult.paymentId,
    });

    if (result.success && result.status === "PAID") {
      return NextResponse.redirect(new URL(`/success?order=${orderId}`, baseUrl));
    } else {
      return NextResponse.redirect(new URL("/cart?error=payment_failed", baseUrl));
    }
  } catch (error) {
    console.error("iyzico callback error:", error);
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/cart?error=payment_error", baseUrl));
  }
}
