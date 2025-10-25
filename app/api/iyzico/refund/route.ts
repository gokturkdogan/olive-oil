import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const Iyzipay = require("iyzipay");
    const { paymentTransactionId, amount } = await request.json();
    
    if (!paymentTransactionId) {
      return NextResponse.json(
        { success: false, error: "PaymentTransactionId gerekli" },
        { status: 400 }
      );
    }

    console.log("🔄 İyzico refund başlatılıyor (SDK API), PaymentTransactionId:", paymentTransactionId, "Amount:", amount);
    
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
    });

    const refundBody = {
      locale: "tr",
      conversationId: `refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      paymentTransactionId: paymentTransactionId,
      ...(amount && { price: amount.toFixed(2) }) // Amount already in TL
    };

    console.log("Refund Body:", JSON.stringify(refundBody, null, 2));

    const result = await new Promise<any>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("İyzico SDK timeout (30s)"));
      }, 30000);

      iyzipay.refund.create(refundBody, (err: any, res: any) => {
        clearTimeout(timeoutId);
        
        if (err) {
          console.error("❌ İyzico Refund Error:");
          console.error(JSON.stringify(err, null, 2));
          resolve(err);
        } else {
          console.log("✅ İyzico Refund Success:");
          console.log(JSON.stringify(res, null, 2));
          resolve(res);
        }
      });
    });
    
    console.log("✅ İyzico refund tamamlandı:", result);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Refund payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
