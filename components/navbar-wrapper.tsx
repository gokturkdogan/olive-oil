import { auth } from "@/auth";
import { NavbarClient } from "./navbar";
import { getCart } from "@/actions/cart";
import { db } from "@/lib/db";

export async function Navbar() {
  const session = await auth();
  const cart = await getCart();
  
  // Calculate total items in cart
  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  
  // Get user's loyalty tier if logged in
  let loyaltyTier = null;
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { loyalty_tier: true },
    });
    loyaltyTier = user?.loyalty_tier || "STANDARD";
  }
  
  return <NavbarClient session={session} cartItemsCount={cartItemsCount} loyaltyTier={loyaltyTier} />;
}


