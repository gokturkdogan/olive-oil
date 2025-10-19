"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { validateCoupon, incrementCouponUsage } from "@/lib/coupons";
import { calculateShippingFee } from "@/lib/shipping";
import { sendOrderConfirmationEmail } from "@/lib/email";
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
  const startTime = Date.now();
  console.log("\n🎯 ========================================");
  console.log("🎯 createOrder() BAŞLADI");
  console.log("🎯 Timestamp:", new Date().toISOString());
  console.log("🎯 ========================================\n");
  
  try {
    console.log("🔐 Auth kontrol ediliyor...");
    const session = await auth();
    console.log("👤 User:", session?.user?.email || "Guest");
    
    console.log("🛒 Cart alınıyor...");
    const cart = await getCart();

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Sepetiniz boş" };
    }

    // Get user's loyalty tier for shipping calculation
    let loyaltyTier = "STANDARD";
    if (session?.user?.id) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { loyalty_tier: true },
      });
      loyaltyTier = user?.loyalty_tier || "STANDARD";
    }
    console.log("🎖️ Loyalty Tier:", loyaltyTier);

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

    // Calculate shipping fee based on loyalty tier and subtotal
    const shippingFee = calculateShippingFee(subtotal, loyaltyTier as any);
    console.log("🚚 Shipping Fee:", shippingFee, "(Subtotal:", subtotal, ")");

    // Calculate total
    const total = subtotal - discountTotal + shippingFee;

    if (total < 0) {
      return { success: false, error: "Geçersiz sipariş tutarı" };
    }

    // ÖNCE İyzico'yu test et, SONRA order oluştur
    // Geçici conversationId oluştur
    const tempConversationId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

    // Format phone number with +90 if not present
    let formattedPhone = data.shippingPhone.replace(/\s/g, ""); // Remove spaces
    if (!formattedPhone.startsWith("+90") && !formattedPhone.startsWith("90")) {
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+90" + formattedPhone.substring(1);
      } else {
        formattedPhone = "+90" + formattedPhone;
      }
    } else if (formattedPhone.startsWith("90")) {
      formattedPhone = "+" + formattedPhone;
    }

    // İyzico için toplam hesaplama
    // NOT: İyzico'da price = basketItems toplamı olmalı (indirim öncesi)
    // paidPrice = gerçekte ödenen tutar (indirim sonrası)
    const iyzicoPrice = subtotal + shippingFee; // İndirim öncesi toplam
    const iyzicoPaidPrice = total; // İndirim sonrası ödenecek tutar
    
    console.log("💰 İyzico Fiyat Hesaplaması:");
    console.log("  Subtotal:", subtotal / 100, "TL");
    console.log("  Shipping:", shippingFee / 100, "TL");
    console.log("  Discount:", discountTotal / 100, "TL");
    console.log("  Price (basketItems toplamı):", iyzicoPrice / 100, "TL");
    console.log("  PaidPrice (ödenecek):", iyzicoPaidPrice / 100, "TL");

    const iyzicoParams = {
      locale: "tr",
      conversationId: tempConversationId, // Geçici ID kullan
      price: (iyzicoPrice / 100).toFixed(2), // İndirim öncesi toplam
      paidPrice: (iyzicoPaidPrice / 100).toFixed(2), // İndirim sonrası toplam
      currency: "TRY",
      basketId: cart.id,
      paymentGroup: "PRODUCT",
      paymentChannel: "WEB", // ZORUNLU: Ödeme kanalı
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9], // Taksit seçenekleri
      buyer: {
        id: session?.user?.id || tempConversationId,
        name,
        surname,
        gsmNumber: formattedPhone,
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
      basketItems: [
        // Ürünler
        ...cart.items.map((item) => ({
          id: item.product.id,
          name: item.product.title,
          category1: "Zeytinyağı",
          itemType: "PHYSICAL",
          price: ((item.product.price * item.quantity) / 100).toFixed(2),
        })),
        // Kargo ücreti (eğer varsa)
        ...(shippingFee > 0 ? [{
          id: "SHIPPING",
          name: "Kargo",
          category1: "Kargo",
          itemType: "PHYSICAL",
          price: (shippingFee / 100).toFixed(2),
        }] : []),
      ],
    };

    console.log("\n📦 Basket Items:");
    iyzicoParams.basketItems.forEach((item: any, index: number) => {
      console.log(`  ${index + 1}. ${item.name}: ${item.price} TL`);
    });
    const basketItemsTotal = iyzicoParams.basketItems.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0);
    console.log(`  Basket Items Toplamı: ${basketItemsTotal.toFixed(2)} TL`);
    console.log(`  İyzico Price: ${iyzicoParams.price} TL`);
    console.log(`  İyzico PaidPrice: ${iyzicoParams.paidPrice} TL`);
    console.log(`  ✅ Toplamlar ${basketItemsTotal.toFixed(2) === iyzicoParams.price ? 'EŞİT' : '❌ EŞİT DEĞİL!'}`);

    console.log("\n========================================");
    console.log("🚀 ÖNCE İyzico API test ediliyor (order henüz oluşturulmadı)...");
    console.log("⏰ Server Time:", new Date().toISOString());
    console.log("========================================");
    
    let paymentResult;
    try {
      const startTime = Date.now();
      console.log("🔄 createCheckoutForm() çağrılıyor...");
      
      paymentResult = await createCheckoutForm(iyzicoParams);
      
      const elapsed = Date.now() - startTime;
      console.log(`📥 İyzico yanıt aldı (${elapsed}ms):`, paymentResult);
    } catch (error: any) {
      console.error("❌ İyzico API hatası:", error.message);
      console.error("❌ Error stack:", error.stack);
      
      // Order henüz oluşturulmadı, sadece hata dön
      return {
        success: false,
        error: "Ödeme sistemine bağlanılamadı. Lütfen tekrar deneyin. Sepetiniz korundu.",
      };
    }

    if (paymentResult.status !== "success") {
      console.error("⚠️ İyzico başarısız status:", paymentResult);
      
      // Order henüz oluşturulmadı, sadece hata dön
      return {
        success: false,
        error: paymentResult.errorMessage || "Ödeme başlatılamadı. Lütfen tekrar deneyin. Sepetiniz korundu.",
      };
    }

    // ✅ İyzico başarılı! ŞİMDİ order oluştur
    console.log("✅ İyzico başarılı! Şimdi order oluşturuluyor...");
    
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
        payment_reference: paymentResult.token,
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

    console.log("✅ Order oluşturuldu:", order.id);

    // Send order confirmation email (async, don't wait for it)
    const shippingAddressText = `${data.shippingName}\n${data.shippingAddressLine1}${data.shippingAddressLine2 ? '\n' + data.shippingAddressLine2 : ''}\n${data.district}, ${data.city} ${data.postalCode}\n${data.country}`;
    
    sendOrderConfirmationEmail(data.email, {
      orderId: order.id,
      name: data.shippingName,
      total,
      subtotal,
      shippingFee,
      discount: discountTotal,
      shippingAddress: shippingAddressText,
      items: cart.items.map(item => ({
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
      })),
    }).catch((error) => {
      console.error("Order confirmation email failed:", error);
      // Don't fail order if email fails
    });

    const totalElapsed = Date.now() - startTime;
    console.log(`\n🎉 ========================================`);
    console.log(`🎉 createOrder() BAŞARILI (${totalElapsed}ms)`);
    console.log(`🎉 Order ID:`, order.id);
    console.log(`🎉 Payment URL:`, paymentResult.paymentPageUrl);
    console.log(`🎉 ========================================\n`);

    return {
      success: true,
      orderId: order.id,
      paymentPageUrl: paymentResult.paymentPageUrl,
      paymentToken: paymentResult.token,
    };
  } catch (error: any) {
    const totalElapsed = Date.now() - startTime;
    console.error(`\n💥 ========================================`);
    console.error(`💥 createOrder() HATA (${totalElapsed}ms)`);
    console.error("💥 Error message:", error.message);
    console.error("💥 Error stack:", error.stack);
    console.error(`💥 ========================================\n`);
    
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

