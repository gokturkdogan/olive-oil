import { db } from "@/lib/db";
import { calculatePercentageDiscount } from "@/lib/money";

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  discount?: number;
  coupon?: {
    id: string;
    code: string;
    type: string;
    value: number;
  };
}

/**
 * Kupon kodunu doğrular ve indirim miktarını hesaplar
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  try {
    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { valid: false, error: "Geçersiz kupon kodu" };
    }

    if (!coupon.active) {
      return { valid: false, error: "Bu kupon artık geçerli değil" };
    }

    // Check date range
    const now = new Date();
    if (now < coupon.starts_at) {
      return { valid: false, error: "Bu kupon henüz geçerli değil" };
    }

    if (now > coupon.ends_at) {
      return { valid: false, error: "Bu kuponun süresi dolmuş" };
    }

    // Check usage limit
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, error: "Bu kuponun kullanım limiti dolmuş" };
    }

    // Check minimum order amount
    if (coupon.min_order_amount !== null && subtotal < coupon.min_order_amount) {
      return {
        valid: false,
        error: `Bu kupon en az ${(coupon.min_order_amount / 100).toFixed(2)} TL tutarındaki siparişler için geçerlidir`,
      };
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = calculatePercentageDiscount(subtotal, coupon.value);
    } else if (coupon.type === "FIXED") {
      discount = Math.min(coupon.value, subtotal); // İndirim tutarı sepet toplamını geçemez
    }

    return {
      valid: true,
      discount,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
    };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return { valid: false, error: "Kupon doğrulanırken bir hata oluştu" };
  }
}

/**
 * Kupon kullanım sayısını artırır
 */
export async function incrementCouponUsage(couponId: string) {
  try {
    await db.coupon.update({
      where: { id: couponId },
      data: {
        used_count: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Increment coupon usage error:", error);
    return { success: false };
  }
}

