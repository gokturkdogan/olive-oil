"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { OrderStatus } from "@prisma/client";

/**
 * Sipariş durumunu günceller (Admin)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, error: "Sipariş durumu güncellenemedi" };
  }
}

/**
 * Sipariş kargo bilgilerini günceller (Admin)
 */
export async function updateOrderShipping(
  orderId: string,
  shippingProvider: string,
  trackingCode: string
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    await db.order.update({
      where: { id: orderId },
      data: {
        shipping_provider: shippingProvider,
        tracking_code: trackingCode,
        status: "SHIPPED", // Kargo bilgisi girilince otomatik SHIPPED yap
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    console.error("Update shipping error:", error);
    return { success: false, error: "Kargo bilgileri güncellenemedi" };
  }
}

