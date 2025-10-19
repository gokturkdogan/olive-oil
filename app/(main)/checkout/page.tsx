import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { getUserAddresses } from "@/actions/addresses";
import { CheckoutClient } from "@/components/checkout-client";
import { db } from "@/lib/db";

export default async function CheckoutPage() {
  const session = await auth();
  const cart = await getCart();

  // Redirect if cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  // Get user data with loyalty tier if logged in
  let addresses = [];
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

  return (
    <CheckoutClient
      session={session}
      cart={cart}
      addresses={addresses}
      loyaltyTier={loyaltyTier}
    />
  );
}
