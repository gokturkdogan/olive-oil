import { auth } from "@/auth";
import { NavbarClient } from "./navbar";
import { getCart } from "@/actions/cart";

export async function Navbar() {
  const session = await auth();
  const cart = await getCart();
  
  // Calculate total items in cart
  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  
  return <NavbarClient session={session} cartItemsCount={cartItemsCount} />;
}


