import { auth } from "@/auth";
import { NavbarClient } from "./navbar";

export async function Navbar() {
  const session = await auth();
  return <NavbarClient session={session} />;
}

