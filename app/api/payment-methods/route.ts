import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: any = { active: true };
    if (type) {
      where.type = type;
    }

    const paymentMethods = await db.paymentMethod.findMany({
      where,
      orderBy: { created_at: "asc" },
    });

    return NextResponse.json({
      success: true,
      paymentMethods: paymentMethods as any[],
    });
  } catch (error: any) {
    console.error("Payment methods fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ödeme yöntemleri alınamadı",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

