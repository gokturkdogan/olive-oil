/**
 * Kargo ücreti hesaplama fonksiyonu
 * 
 * Kurallar:
 * - Standart: 3000 TL üzeri ücretsiz, altı 50 TL
 * - Gold: 1000 TL üzeri ücretsiz, altı 50 TL
 * - Platinum ve Diamond: Her zaman ücretsiz
 */

const SHIPPING_FEE = 50_00; // 50 TL (kuruş cinsinden)

// Free shipping thresholds (in cents/kuruş)
const FREE_SHIPPING_THRESHOLDS = {
  STANDARD: 3000_00,  // 3000 TL
  GOLD: 1000_00,      // 1000 TL
  PLATINUM: 0,        // Her zaman ücretsiz
  DIAMOND: 0,         // Her zaman ücretsiz
} as const;

type LoyaltyTier = "STANDARD" | "GOLD" | "PLATINUM" | "DIAMOND";

/**
 * Kargo ücretini hesaplar
 * @param subtotal Sepet toplamı (kuruş cinsinden)
 * @param loyaltyTier Kullanıcının loyalty tier'ı
 * @returns Kargo ücreti (kuruş cinsinden)
 */
export function calculateShippingFee(
  subtotal: number,
  loyaltyTier: LoyaltyTier = "STANDARD"
): number {
  // Platinum ve Diamond için her zaman ücretsiz
  if (loyaltyTier === "PLATINUM" || loyaltyTier === "DIAMOND") {
    return 0;
  }

  // Threshold'u al
  const threshold = FREE_SHIPPING_THRESHOLDS[loyaltyTier];

  // Threshold'un üzerindeyse ücretsiz
  if (subtotal >= threshold) {
    return 0;
  }

  // Altındaysa 50 TL
  return SHIPPING_FEE;
}

/**
 * Ücretsiz kargo için kalan tutarı hesaplar
 * @param subtotal Sepet toplamı (kuruş cinsinden)
 * @param loyaltyTier Kullanıcının loyalty tier'ı
 * @returns Ücretsiz kargo için kalan tutar (kuruş cinsinden) veya null (zaten ücretsiz ise)
 */
export function getRemainingForFreeShipping(
  subtotal: number,
  loyaltyTier: LoyaltyTier = "STANDARD"
): number | null {
  // Platinum ve Diamond için zaten ücretsiz
  if (loyaltyTier === "PLATINUM" || loyaltyTier === "DIAMOND") {
    return null;
  }

  const threshold = FREE_SHIPPING_THRESHOLDS[loyaltyTier];

  // Zaten threshold'un üzerindeyse null
  if (subtotal >= threshold) {
    return null;
  }

  // Kalan tutarı döndür
  return threshold - subtotal;
}

/**
 * Ücretsiz kargo threshold'unu döndürür
 */
export function getFreeShippingThreshold(loyaltyTier: LoyaltyTier = "STANDARD"): number {
  return FREE_SHIPPING_THRESHOLDS[loyaltyTier];
}

/**
 * Kargo ücreti bilgisini formatlı şekilde döndürür
 */
export function getShippingInfo(
  subtotal: number,
  loyaltyTier: LoyaltyTier = "STANDARD"
) {
  const shippingFee = calculateShippingFee(subtotal, loyaltyTier);
  const remaining = getRemainingForFreeShipping(subtotal, loyaltyTier);
  const threshold = FREE_SHIPPING_THRESHOLDS[loyaltyTier];

  return {
    fee: shippingFee,
    isFree: shippingFee === 0,
    remaining,
    threshold,
    loyaltyTier,
  };
}

