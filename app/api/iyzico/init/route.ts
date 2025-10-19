import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const Iyzipay = require("iyzipay");
    const body = await request.json();

    console.log("🔄 İyzico Init API çağrılıyor...");
    console.log("API Key:", process.env.IYZICO_API_KEY ? "✅ Var" : "❌ Yok");
    console.log("Secret Key:", process.env.IYZICO_SECRET_KEY ? "✅ Var" : "❌ Yok");
    console.log("Base URL:", process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com");

    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
      timeout: 10000, // 10 saniye timeout
    });

    // Timeout promise (10 saniye)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("İyzico API timeout (10s)")), 10000);
    });

    // İyzico API promise
    const iyzicoPromise = new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(body, (err: any, result: any) => {
        if (err) {
          console.error("❌ İyzico API Error:", err);
          console.error("Error Details:", JSON.stringify(err, null, 2));
          resolve(
            NextResponse.json(
              { 
                success: false, 
                status: "failure",
                error: err.errorMessage || err.errorCode || "İyzico hatası" 
              },
              { status: 500 }
            )
          );
        } else {
          console.log("✅ İyzico Success Response:", JSON.stringify(result, null, 2));
          resolve(NextResponse.json(result));
        }
      });
    });

    // Race between timeout and API call
    return await Promise.race([iyzicoPromise, timeoutPromise]);
    
  } catch (error: any) {
    console.error("💥 Init payment error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        success: false, 
        status: "failure",
        error: error.message || "İyzico bağlantı hatası" 
      },
      { status: 500 }
    );
  }
}

