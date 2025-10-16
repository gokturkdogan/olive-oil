"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { validateCoupon, incrementCouponUsage } from "@/lib/coupons";
import { redirect } from "next/navigation";
import { createCheckoutForm } from "@/lib/iyzico";

interface CreateOrderData {
  email: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  couponCode?: string;
  saveAddress?: boolean;
  addressTitle?: string;
}

/**
 * Sipariş oluşturur ve iyzico ödeme formunu başlatır
 */
export async function createOrder(data: CreateOrderData) {
  try {
    const session = await auth();
    const cart = await getCart();

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Sepetiniz boş" };
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Validate coupon if provided
    let discountTotal = 0;
    let validCoupon = null;

    if (data.couponCode) {
      const couponResult = await validateCoupon(data.couponCode, subtotal);
      if (!couponResult.valid) {
        return { success: false, error: couponResult.error };
      }
      discountTotal = couponResult.discount || 0;
      validCoupon = couponResult.coupon;
    }

    // Calculate shipping fee (free for now)
    const shippingFee = 0;

    // Calculate total
    const total = subtotal - discountTotal + shippingFee;

    if (total < 0) {
      return { success: false, error: "Geçersiz sipariş tutarı" };
    }

    // Create order
    const order = await db.order.create({
      data: {
        user_id: session?.user?.id || null,
        email: data.email,
        shipping_name: data.shippingName,
        shipping_phone: data.shippingPhone,
        shipping_address_line1: data.shippingAddressLine1,
        shipping_address_line2: data.shippingAddressLine2 || null,
        city: data.city,
        district: data.district,
        postal_code: data.postalCode,
        country: data.country,
        subtotal,
        discount_total: discountTotal,
        shipping_fee: shippingFee,
        total,
        coupon_code: data.couponCode?.toUpperCase() || null,
        status: "PENDING",
      },
    });

    // Create order items (snapshot)
    for (const item of cart.items) {
      await db.orderItem.create({
        data: {
          order_id: order.id,
          product_id: item.product.id,
          title_snapshot: item.product.title,
          unit_price_snapshot: item.product.price,
          quantity: item.quantity,
          line_total: item.product.price * item.quantity,
        },
      });
    }

    // Save address if requested
    if (session?.user?.id && data.saveAddress && data.addressTitle) {
      try {
        // Check if address title already exists
        const existingAddress = await db.address.findFirst({
          where: {
            user_id: session.user.id,
            title: data.addressTitle,
          },
        });

        if (!existingAddress) {
          await db.address.create({
            data: {
              user_id: session.user.id,
              title: data.addressTitle,
              name: data.shippingName,
              phone: data.shippingPhone,
              address_line1: data.shippingAddressLine1,
              address_line2: data.shippingAddressLine2 || null,
              city: data.city,
              district: data.district,
              postal_code: data.postalCode,
              country: data.country,
              is_default: false,
            },
          });
        }
      } catch (error) {
        console.error("Save address error:", error);
        // Continue with order even if address save fails
      }
    }

    // Initialize iyzico payment
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/iyzico/callback`;

    // Prepare buyer info
    const [name, ...surnameParts] = data.shippingName.split(" ");
    const surname = surnameParts.join(" ") || name;

    const iyzicoParams = {
      locale: "tr",
      conversationId: order.id,
      price: (total / 100).toFixed(2),
      paidPrice: (total / 100).toFixed(2),
      currency: "TRY",
      basketId: cart.id,
      paymentGroup: "PRODUCT",
      callbackUrl,
      buyer: {
        id: session?.user?.id || order.id,
        name,
        surname,
        gsmNumber: data.shippingPhone,
        email: data.email,
        identityNumber: "11111111111", // MVP: dummy identity number
        registrationAddress: data.shippingAddressLine1,
        ip: "85.34.78.112", // MVP: dummy IP (should be real in production)
        city: data.city,
        country: data.country,
        zipCode: data.postalCode,
      },
      shippingAddress: {
        contactName: data.shippingName,
        city: data.city,
        country: data.country,
        address: `${data.shippingAddressLine1} ${data.shippingAddressLine2 || ""}`.trim(),
        zipCode: data.postalCode,
      },
      billingAddress: {
        contactName: data.shippingName,
        city: data.city,
        country: data.country,
        address: `${data.shippingAddressLine1} ${data.shippingAddressLine2 || ""}`.trim(),
        zipCode: data.postalCode,
      },
      basketItems: cart.items.map((item) => ({
        id: item.product.id,
        name: item.product.title,
        category1: "Zeytinyağı",
        itemType: "PHYSICAL",
        price: ((item.product.price * item.quantity) / 100).toFixed(2),
      })),
    };

    const paymentResult = await createCheckoutForm(iyzicoParams);

    if (paymentResult.status !== "success") {
      // Delete order if payment initialization failed
      await db.order.delete({ where: { id: order.id } });
      return {
        success: false,
        error: "Ödeme başlatılamadı. Lütfen tekrar deneyin.",
      };
    }

    // Save payment token
    await db.order.update({
      where: { id: order.id },
      data: {
        payment_reference: paymentResult.token,
      },
    });

    return {
      success: true,
      orderId: order.id,
      paymentPageUrl: paymentResult.paymentPageUrl,
      paymentToken: paymentResult.token,
    };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "Sipariş oluşturulurken bir hata oluştu",
    };
  }
}

/**
 * Siparişi tamamlar (iyzico callback sonrası)
 */
export async function completeOrder(orderId: string, paymentData: any) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Sipariş bulunamadı" };
    }

    if (order.status !== "PENDING") {
      return { success: false, error: "Sipariş zaten işlenmiş" };
    }

    // Update order status
    await db.order.update({
      where: { id: orderId },
      data: {
        status: paymentData.status === "success" ? "PAID" : "FAILED",
        payment_reference: paymentData.paymentId || order.payment_reference,
      },
    });

    if (paymentData.status === "success") {
      // Decrement stock
      for (const item of order.items) {
        await db.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Increment coupon usage
      if (order.coupon_code) {
        const coupon = await db.coupon.findUnique({
          where: { code: order.coupon_code },
        });
        if (coupon) {
          await incrementCouponUsage(coupon.id);
        }
      }

      // Clear cart
      const cart = await db.cart.findFirst({
        where: {
          OR: [
            { user_id: order.user_id },
            { items: { some: { cart_id: { not: undefined } } } },
          ],
        },
      });

      if (cart) {
        await db.cartItem.deleteMany({
          where: { cart_id: cart.id },
        });
      }

      return { success: true, status: "PAID" };
    }

    return { success: true, status: "FAILED" };
  } catch (error) {
    console.error("Complete order error:", error);
    return { success: false, error: "Sipariş tamamlanamadı" };
  }
}

