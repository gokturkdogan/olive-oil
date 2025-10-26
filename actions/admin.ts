"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { OrderStatus } from "@prisma/client";
import { calculateLoyaltyTier } from "@/lib/loyalty";
import { sendOrderStatusUpdateEmail, sendOrderCancellationEmail } from "@/lib/email";

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
        email: true,
        shipping_name: true,
        tracking_code: true,
        shipping_provider: true,
        subtotal: true,
        discount_total: true,
        shipping_fee: true,
        items: {
          select: {
            id: true,
            title_snapshot: true,
            quantity: true,
            unit_price_snapshot: true,
            line_total: true,
            image_url: true,
          },
        },
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

    // Send email notification if status changed (and it's not the first status)
    if (order.status !== status) {
      try {
        // Check if order is cancelled
        if (status === "CANCELLED") {
          // Prepare order items for email
          const orderItems = order.items.map(item => ({
            title: item.title_snapshot,
            quantity: item.quantity,
            price: item.unit_price_snapshot,
            imageUrl: item.image_url,
            lineTotal: item.line_total,
          }));

          // Send cancellation email
          await sendOrderCancellationEmail(order.email, {
            orderId: order.id,
            name: order.shipping_name,
            reason: "Sipariş admin tarafından iptal edildi.",
            items: orderItems,
            total: order.total,
            trackingCode: order.tracking_code || undefined,
            shippingProvider: order.shipping_provider || undefined,
          });
        } else {
          // Prepare order items for email
          const orderItems = order.items.map(item => ({
            title: item.title_snapshot,
            quantity: item.quantity,
            price: item.unit_price_snapshot,
            imageUrl: item.image_url,
            lineTotal: item.line_total,
          }));

          // Send status update email
          await sendOrderStatusUpdateEmail(order.email, {
            orderId: order.id,
            name: order.shipping_name,
            status: status,
            trackingCode: order.tracking_code || undefined,
            shippingProvider: order.shipping_provider || undefined,
            items: orderItems,
            subtotal: order.subtotal,
            shippingFee: order.shipping_fee,
            discountTotal: order.discount_total,
            total: order.total,
          });
        }
      } catch (emailError) {
        console.error("Email gönderilirken hata oluştu:", emailError);
        // Continue with order update even if email fails
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

    // Get order before update to check if status is changing to SHIPPED
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        email: true,
        shipping_name: true,
        status: true,
        subtotal: true,
        discount_total: true,
        shipping_fee: true,
        total: true,
        items: {
          select: {
            id: true,
            title_snapshot: true,
            quantity: true,
            unit_price_snapshot: true,
            line_total: true,
            image_url: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Sipariş bulunamadı" };
    }

    await db.order.update({
      where: { id: orderId },
      data: {
        shipping_provider: shippingProvider,
        tracking_code: trackingCode,
        status: "SHIPPED", // Kargo bilgisi girilince otomatik SHIPPED yap
      },
    });

    // Send email notification if status is changing to SHIPPED
    if (order.status !== "SHIPPED") {
      try {
        const orderItems = order.items.map(item => ({
          title: item.title_snapshot,
          quantity: item.quantity,
          price: item.unit_price_snapshot,
          imageUrl: item.image_url,
          lineTotal: item.line_total,
        }));

        await sendOrderStatusUpdateEmail(order.email, {
          orderId: order.id,
          name: order.shipping_name,
          status: "SHIPPED",
          trackingCode: trackingCode,
          shippingProvider: shippingProvider,
          items: orderItems,
          subtotal: order.subtotal,
          shippingFee: order.shipping_fee,
          discountTotal: order.discount_total,
          total: order.total,
        });
      } catch (emailError) {
        console.error("Email gönderilirken hata oluştu:", emailError);
        // Continue even if email fails
      }
    }

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
  imageUrl?: string | string[];
  active: boolean;
  category_id?: string;
  subcategory_id?: string;
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
        images: data.imageUrl ? (Array.isArray(data.imageUrl) ? data.imageUrl : [data.imageUrl]) : [],
        active: data.active,
        category_id: data.category_id || undefined,
        subcategory_id: data.subcategory_id || undefined,
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
    imageUrl?: string | string[];
    active: boolean;
    category_id?: string;
    subcategory_id?: string;
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
        images: data.imageUrl ? (Array.isArray(data.imageUrl) ? data.imageUrl : [data.imageUrl]) : [],
        active: data.active,
        category_id: data.category_id || undefined,
        subcategory_id: data.subcategory_id || undefined,
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

/**
 * Manuel iadeyi tamamlandı olarak işaretler (Admin)
 */
export async function markRefundCompleted(orderId: string) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Yetkisiz erişim" };
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { id: true, refund_status: true },
    });

    if (!order) {
      return { success: false, error: "Sipariş bulunamadı" };
    }

    if (order.refund_status !== "MANUAL_REQUIRED") {
      return { success: false, error: "Bu sipariş için manuel iade gerekmiyor" };
    }

    await db.order.update({
      where: { id: orderId },
      data: { refund_status: "MANUAL_COMPLETED" },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    console.error("Mark refund completed error:", error);
    return { success: false, error: "İade durumu güncellenemedi" };
  }
}

