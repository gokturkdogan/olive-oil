// app/api/admin/cleanup-pending-orders/route.ts - Admin API route

import { NextRequest, NextResponse } from "next/server";
import { cleanupPendingOrders, cleanupUserPendingOrders } from "@/lib/order-cleanup";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userId, cleanupUser } = body;

    // Admin kontrolü (sadece genel temizleme için)
    if (!cleanupUser) {
      const session = await auth();
      if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    let result;
    if (cleanupUser) {
      // Kullanıcı checkout'tan ayrıldığında çağrılır
      result = await cleanupUserPendingOrders(userId, userEmail);
    } else {
      // Admin panelinden çağrılır
      result = await cleanupPendingOrders();
    }
    
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} adet PENDING order temizlendi`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("❌ Cleanup API hatası:", error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin kontrolü
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Sadece kaç tane PENDING order olduğunu göster
    const { db } = await import("@/lib/db");
    
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 dakika önce
    
    const pendingCount = await db.order.count({
      where: {
        status: "PENDING",
        created_at: {
          lt: cutoffTime
        }
      }
    });

    return NextResponse.json({
      success: true,
      pendingCount,
      message: `${pendingCount} adet temizlenebilir PENDING order bulundu`
    });
  } catch (error) {
    console.error("❌ PENDING order count hatası:", error);
    return NextResponse.json(
      { error: "Count failed" },
      { status: 500 }
    );
  }
}
