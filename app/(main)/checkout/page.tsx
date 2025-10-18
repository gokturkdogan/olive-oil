import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { getUserAddresses } from "@/actions/addresses";
import { CheckoutClient } from "@/components/checkout-client";

export default async function CheckoutPage() {
  const session = await auth();
  const cart = await getCart();

  // Redirect if cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  // Get user addresses if logged in
  let addresses = [];
  if (session?.user?.id) {
    addresses = await getUserAddresses();
  }

  return (
    <CheckoutClient
      session={session}
      cart={cart}
      addresses={addresses}
    />
  );
}
