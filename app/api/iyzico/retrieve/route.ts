import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const Iyzipay = require("iyzipay");
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token gerekli" },
        { status: 400 }
      );
    }


    
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
    });

    const result = await new Promise<any>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("İyzico SDK timeout (30s)"));
      }, 30000);

      iyzipay.checkoutForm.retrieve({ locale: "tr", token }, (err: any, res: any) => {
        clearTimeout(timeoutId);
        
        if (err) {
          console.error("❌ İyzico SDK Error:");
          console.error(JSON.stringify(err, null, 2));
          resolve(err);
        } else {


          resolve(res);
        }
      });
    });
    

    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Retrieve payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

