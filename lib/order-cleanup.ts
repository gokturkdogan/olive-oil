// lib/order-cleanup.ts - PENDING order'ları temizleme sistemi

import { db } from "@/lib/db";

/**
 * Belirli süre geçmiş PENDING order'ları temizler
 * Bu fonksiyon cron job veya scheduled task olarak çalıştırılabilir
 */
export async function cleanupPendingOrders() {
  const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 dakika önce
  
  try {
    const pendingOrders = await db.order.findMany({
      where: {
        status: "PENDING",
        created_at: {
          lt: cutoffTime
        }
      },
      include: {
        items: true
      }
    });

    console.log(`🧹 ${pendingOrders.length} adet eski PENDING order bulundu`);

    for (const order of pendingOrders) {
      // Order items'ları sil (cascade ile otomatik silinir)
      await db.orderItem.deleteMany({
        where: { order_id: order.id }
      });

      // Order'ı sil
      await db.order.delete({
        where: { id: order.id }
      });

      console.log(`🗑️ Order ${order.id} silindi (${order.created_at})`);
    }

    return {
      success: true,
      deletedCount: pendingOrders.length
    };
  } catch (error) {
    console.error("❌ PENDING order temizleme hatası:", error);
    return {
      success: false,
      error: "Order temizleme başarısız"
    };
  }
}

/**
 * Kullanıcı checkout sayfasından ayrıldığında çağrılır
 * Bu kullanıcının PENDING order'ını temizler
 */
export async function cleanupUserPendingOrders(userId?: string, email?: string) {
  try {
    const whereClause: any = {
      status: "PENDING"
    };

    if (userId) {
      whereClause.user_id = userId;
    } else if (email) {
      whereClause.email = email;
    }

    const pendingOrders = await db.order.findMany({
      where: whereClause,
      include: {
        items: true
      }
    });

    for (const order of pendingOrders) {
      // Order items'ları sil
      await db.orderItem.deleteMany({
        where: { order_id: order.id }
      });

      // Order'ı sil
      await db.order.delete({
        where: { id: order.id }
      });

      console.log(`🗑️ Kullanıcı PENDING order ${order.id} silindi`);
    }

    return {
      success: true,
      deletedCount: pendingOrders.length
    };
  } catch (error) {
    console.error("❌ Kullanıcı PENDING order temizleme hatası:", error);
    return {
      success: false,
      error: "Order temizleme başarısız"
    };
  }
}
