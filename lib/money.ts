/**
 * Para hesaplama yardımcıları
 * Tüm tutarlar kuruş bazında saklanır (int)
 */

/**
 * TL'yi kuruşa çevirir
 * @param tl - TL cinsinden tutar
 * @returns Kuruş cinsinden tutar
 */
export function tlToKurus(tl: number): number {
  return Math.round(tl * 100);
}

/**
 * Kuruşu TL'ye çevirir
 * @param kurus - Kuruş cinsinden tutar
 * @returns TL cinsinden tutar
 */
export function kurusToTl(kurus: number): number {
  return kurus / 100;
}

/**
 * Kuruş tutarını formatlanmış TL string'ine çevirir
 * @param kurus - Kuruş cinsinden tutar
 * @returns Formatlanmış TL string (örn: "125,50 ₺")
 */
export function formatPrice(kurus: number): string {
  const tl = kurusToTl(kurus);
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(tl);
}

/**
 * Yüzde indirim hesaplar
 * @param amount - Orijinal tutar (kuruş)
 * @param percentage - İndirim yüzdesi (0-100)
 * @returns İndirim tutarı (kuruş)
 */
export function calculatePercentageDiscount(
  amount: number,
  percentage: number
): number {
  return Math.round((amount * percentage) / 100);
}

/**
 * İndirim sonrası tutarı hesaplar
 * @param amount - Orijinal tutar (kuruş)
 * @param discount - İndirim tutarı (kuruş)
 * @returns İndirimli tutar (kuruş)
 */
export function applyDiscount(amount: number, discount: number): number {
  return Math.max(0, amount - discount);
}

