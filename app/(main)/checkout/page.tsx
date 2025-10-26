import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { getUserAddresses } from "@/actions/addresses";
import { CheckoutClient } from "@/components/checkout-client";
import { CheckoutProtection } from "@/components/checkout-protection";
import { db } from "@/lib/db";
import { calculateShippingFee, getRemainingForFreeShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/money";

export default async function CheckoutPage() {
  const session = await auth();
  const cart = await getCart();

  // Redirect if cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  // Get user data with loyalty tier if logged in
  let addresses: any[] = [];
  let loyaltyTier = "STANDARD";
  
  if (session?.user?.id) {
    addresses = await getUserAddresses();
    
    // Get user's loyalty tier
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { loyalty_tier: true },
    });
    
    loyaltyTier = user?.loyalty_tier || "STANDARD";
  }

  // Calculate subtotal
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate shipping fee server-side
  const shippingFee = await calculateShippingFee(subtotal, loyaltyTier as any);
  const remainingForFreeShipping = await getRemainingForFreeShipping(subtotal, loyaltyTier as any);
  
  // Get threshold for free shipping reason
  const settings = await db.shippingSettings.findFirst();
  const threshold = settings?.free_shipping_threshold || 200000;
  
  // Determine free shipping reason
  let freeShippingReason = "";
  if (shippingFee === 0 && subtotal > 0) {
    if (loyaltyTier === "PLATINUM" || loyaltyTier === "DIAMOND") {
      freeShippingReason = "VIP üyeliğiniz sayesinde";
    } else if (subtotal >= threshold) {
      freeShippingReason = `${formatPrice(threshold)} sepet tutarı limitini aştığınız için`;
    }
  }

  return (
    <>
      <CheckoutProtection 
        userEmail={session?.user?.email}
        userId={session?.user?.id}
      />
      <CheckoutClient
        session={session}
        cart={cart}
        addresses={addresses}
        loyaltyTier={loyaltyTier}
        shippingFee={shippingFee}
        remainingForFreeShipping={remainingForFreeShipping}
        freeShippingReason={freeShippingReason}
      />
    </>
  );
}
