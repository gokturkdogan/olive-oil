"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { OrderStatus } from "@prisma/client";
import { calculateLoyaltyTier } from "@/lib/loyalty";

/**
 * Sipariş durumunu günceller (Admin)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    // Get order details before updating
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        user_id: true,
        total: true,
        status: true,
      },
    });

    if (!order) {
      return { success: false, error: "Sipariş bulunamadı" };
    }

    // Update order status
    await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    // If status changed to DELIVERED and user exists, update loyalty
    if (status === "DELIVERED" && order.user_id && order.status !== "DELIVERED") {
      // Get current user data
      const user = await db.user.findUnique({
        where: { id: order.user_id },
        select: { total_spent: true },
      });

      if (user) {
        // Calculate new total spent
        const newTotalSpent = user.total_spent + order.total;

        // Calculate new loyalty tier
        const newLoyaltyTier = calculateLoyaltyTier(newTotalSpent);

        // Update user
        await db.user.update({
          where: { id: order.user_id },
          data: {
            total_spent: newTotalSpent,
            loyalty_tier: newLoyaltyTier,
          },
        });
      }
    }

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

/**
 * Yeni ürün ekler (Admin)
 */
export async function createProduct(data: {
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  active: boolean;
}) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct) {
      return { success: false, error: "Bu slug zaten kullanılıyor" };
    }

    await db.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        images: data.imageUrl ? [data.imageUrl] : [],
        active: data.active,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Create product error:", error);
    return { success: false, error: "Ürün eklenemedi" };
  }
}

/**
 * Ürün günceller (Admin)
 */
export async function updateProduct(
  productId: string,
  data: {
    title: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    active: boolean;
  }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    // Check if slug already exists for another product
    const existingProduct = await db.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct && existingProduct.id !== productId) {
      return { success: false, error: "Bu slug başka bir ürün tarafından kullanılıyor" };
    }

    await db.product.update({
      where: { id: productId },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        images: data.imageUrl ? [data.imageUrl] : [],
        active: data.active,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${data.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, error: "Ürün güncellenemedi" };
  }
}

/**
 * Ürün siler (Admin)
 */
export async function deleteProduct(productId: string) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    // Check if product is in any orders
    const ordersWithProduct = await db.orderItem.findFirst({
      where: { product_id: productId },
    });

    if (ordersWithProduct) {
      return { 
        success: false, 
        error: "Bu ürün sipariş geçmişinde var, silinemez. Pasif yapabilirsiniz." 
      };
    }

    await db.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, error: "Ürün silinemedi" };
  }
}

/**
 * Ürün aktiflik durumunu değiştirir (Admin)
 */
export async function toggleProductActive(productId: string) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Ürün bulunamadı" };
    }

    await db.product.update({
      where: { id: productId },
      data: { active: !product.active },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, newStatus: !product.active };
  } catch (error) {
    console.error("Toggle product active error:", error);
    return { success: false, error: "Ürün durumu değiştirilemedi" };
  }
}

