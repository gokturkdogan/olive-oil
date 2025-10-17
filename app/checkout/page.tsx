import { auth } from "@/auth";
import { CheckoutClient } from "@/components/checkout-client";

export default async function CheckoutPage() {
  const session = await auth();
  return <CheckoutClient userEmail={session?.user?.email} />;
}
