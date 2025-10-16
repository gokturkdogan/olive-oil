import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const Iyzipay = require("iyzipay");
    const body = await request.json();

    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
    });

    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(body, (err: any, result: any) => {
        if (err) {
          console.error("İyzico API Error:", err);
          resolve(
            NextResponse.json(
              { success: false, error: err.errorMessage || "İyzico hatası" },
              { status: 500 }
            )
          );
        } else {
          console.log("İyzico Success:", result);
          resolve(NextResponse.json(result));
        }
      });
    });
  } catch (error: any) {
    console.error("Init payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

