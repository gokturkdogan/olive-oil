import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

/**
 * GET - Kargo ayarlarını getir
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // İlk ayarları al veya oluştur
    let settings = await db.shippingSettings.findFirst();

    if (!settings) {
      // İlk kez oluştur
      settings = await db.shippingSettings.create({
        data: {
          base_shipping_fee: 2500, // 25 TL
          free_shipping_threshold: 100000, // 1000 TL
          active: true,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get shipping settings error:", error);
    return NextResponse.json(
      { error: "Ayarlar getirilemedi", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT - Kargo ayarlarını güncelle
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { base_shipping_fee, free_shipping_threshold, active } = body;

    // Kuruş cinsinden alıyoruz, direkt int
    const shippingFee = Math.round(base_shipping_fee * 100); // TL'den kuruş'a
    const threshold = Math.round(free_shipping_threshold * 100); // TL'den kuruş'a

    // İlk ayarları kontrol et, yoksa oluştur
    let settings = await db.shippingSettings.findFirst();

    if (!settings) {
      settings = await db.shippingSettings.create({
        data: {
          base_shipping_fee: shippingFee,
          free_shipping_threshold: threshold,
          active: active !== undefined ? active : true,
        },
      });
    } else {
      settings = await db.shippingSettings.update({
        where: { id: settings.id },
        data: {
          base_shipping_fee: shippingFee,
          free_shipping_threshold: threshold,
          active: active !== undefined ? active : true,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Update shipping settings error:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenemedi", details: String(error) },
      { status: 500 }
    );
  }
}

