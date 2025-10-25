import { NextRequest } from "next/server";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { completeOrder } from "@/actions/orders";
import { db } from "@/lib/db";

function getBaseUrl(request: NextRequest): string {
  // Priority: NEXTAUTH_URL > request headers > fallback
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || 
                   (process.env.NODE_ENV === "production" ? "https" : "http");
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  return "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;
    
    const baseUrl = getBaseUrl(request);
    console.log("=== iyzico Callback Started ===");
    console.log("Base URL:", baseUrl);
    console.log("Token:", token);

    if (!token) {
      console.error("No token received");
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/checkout?payment_return=true&error=invalid_payment',
        },
      });
    }

    // Verify payment with iyzico
    const paymentResult = await retrieveCheckoutForm(token);
    console.log("Payment Result:", JSON.stringify(paymentResult, null, 2));
    
    console.log("🔍 Callback Payment Debug:");
    console.log("  Token:", token);
    console.log("  Payment Status:", paymentResult.paymentStatus);
    console.log("  Payment ID:", paymentResult.paymentId);
    console.log("  Conversation ID:", paymentResult.conversationId);
    console.log("  Transaction ID:", paymentResult.transactionId);

    if (paymentResult.status !== "success") {
      console.error("Payment not successful:", paymentResult.status);
      
      // Find the PENDING order and clean it up
      const order = await db.order.findFirst({
        where: {
          payment_reference: token,
          status: "PENDING",
        }
      });
      
      if (order) {
        console.log("🧹 Ödeme başarısız, PENDING order temizleniyor:", order.id);
        
        // Delete order items first
        await db.orderItem.deleteMany({
          where: { order_id: order.id }
        });
        
        // Delete the order
        await db.order.delete({
          where: { id: order.id }
        });
        
        console.log("✅ PENDING order temizlendi");
      }
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/checkout?payment_return=true&error=payment_failed',
        },
      });
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
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/cart?error=order_not_found',
        },
      });
    }

    const orderId = order.id;
    console.log("Order found:", orderId);
    
    // Complete order
    const result = await completeOrder(orderId, {
      status: paymentResult.paymentStatus === "SUCCESS" ? "success" : "failure",
      paymentId: paymentResult.paymentId,
      itemTransactions: paymentResult.itemTransactions,
    });

    console.log("Complete order result:", result);

    if (result.success && result.status === "PAID") {
      const redirectPath = `/success?order=${orderId}`;
      console.log("Payment successful! Redirecting to:", redirectPath);
      console.log("Full URL:", `${baseUrl}${redirectPath}`);
      console.log("=== iyzico Callback Completed Successfully ===");
      
      // Use Response with Location header instead of NextResponse.redirect
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectPath,
        },
      });
    } else {
      console.error("Order completion failed:", result);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/cart?error=payment_failed',
        },
      });
    }
  } catch (error) {
    console.error("=== iyzico Callback Error ===");
    console.error("Error:", error);
    console.error("Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/cart?error=payment_error',
      },
    });
  }
}
