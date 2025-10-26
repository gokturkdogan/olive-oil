/**
 * Kargo ücreti hesaplama fonksiyonu
 * 
 * Kurallar:
 * - Standart: 3000 TL üzeri ücretsiz, altı 50 TL
 * - Gold: 1000 TL üzeri ücretsiz, altı 50 TL
 * - Platinum ve Diamond: Her zaman ücretsiz
 */

import { db } from "@/lib/db";

type LoyaltyTier = "STANDARD" | "GOLD" | "PLATINUM" | "DIAMOND";

// Database'den kargo ayarlarını al (cache OFF - always fetch)
async function getShippingSettings() {
  try {
    const settings = await db.shippingSettings.findFirst();
    
    if (!settings) {
      // Default değerler
      return {
        baseFee: 5000, // 50 TL default
        threshold: 100000, // 1000 TL default
        active: true,
      };
    }

    return {
      baseFee: settings.base_shipping_fee,
      threshold: settings.free_shipping_threshold,
      active: settings.active,
    };
  } catch (error) {
    console.error("Get shipping settings error:", error);
    // Fallback to default
    return {
      baseFee: 5000,
      threshold: 100000,
      active: true,
    };
  }
}

// Free shipping thresholds for loyalty tiers (cached database ayarlarıyla merge edilecek)
const FREE_SHIPPING_THRESHOLDS = {
  STANDARD: 3000_00,  // 3000 TL (default)
  GOLD: 1000_00,      // 1000 TL (default)
  PLATINUM: 0,        // Her zaman ücretsiz
  DIAMOND: 0,         // Her zaman ücretsiz
} as const;

/**
 * Kargo ücretini hesaplar
 * @param subtotal Sepet toplamı (kuruş cinsinden)
 * @param loyaltyTier Kullanıcının loyalty tier'ı
 * @returns Kargo ücreti (kuruş cinsinden)
 */
export async function calculateShippingFee(
  subtotal: number,
  loyaltyTier: LoyaltyTier = "STANDARD"
): Promise<number> {
  // Ayarlar aktif değilse ücretsiz
  const settings = await getShippingSettings();
  if (!settings.active) {
    return 0;
  }

  // Platinum ve Diamond için her zaman ücretsiz
  if (loyaltyTier === "PLATINUM" || loyaltyTier === "DIAMOND") {
    return 0;
  }

  // Threshold database ayarlarından al (tüm tier'lar için)
  const threshold = settings.threshold;

  // Threshold'un üzerindeyse ücretsiz
  if (subtotal >= threshold) {
    return 0;
  }

  // Altındaysa database'deki ücret
  return settings.baseFee;
}

/**
 * Ücretsiz kargo için kalan tutarı hesaplar
 * @param subtotal Sepet toplamı (kuruş cinsinden)
 * @param loyaltyTier Kullanıcının loyalty tier'ı
 * @returns Ücretsiz kargo için kalan tutar (kuruş cinsinden) veya null (zaten ücretsiz ise)
 */
export async function getRemainingForFreeShipping(
  subtotal: number,
  loyaltyTier: LoyaltyTier = "STANDARD"
): Promise<number | null> {
  // Platinum ve Diamond için zaten ücretsiz
  if (loyaltyTier === "PLATINUM" || loyaltyTier === "DIAMOND") {
    return null;
  }

  const settings = await getShippingSettings();
  // Tüm tier'lar için DB'den threshold kullan
  const threshold = settings.threshold;

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
export async function getFreeShippingThreshold(loyaltyTier: LoyaltyTier = "STANDARD"): Promise<number> {
  const settings = await getShippingSettings();
  // Her zaman DB'den threshold al
  return settings.threshold;
}

/**
 * Kargo ücreti bilgisini formatlı şekilde döndürür
 */
export async function getShippingInfo(
  subtotal: number,
  loyaltyTier: LoyaltyTier = "STANDARD"
) {
  const shippingFee = await calculateShippingFee(subtotal, loyaltyTier);
  const remaining = await getRemainingForFreeShipping(subtotal, loyaltyTier);
  const threshold = await getFreeShippingThreshold(loyaltyTier);

  return {
    fee: shippingFee,
    isFree: shippingFee === 0,
    remaining,
    threshold,
    loyaltyTier,
  };
}

