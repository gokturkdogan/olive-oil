import Link from "next/link";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            Zeytinyağı
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Ürünler
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Sepet</span>
              </Button>
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {session.user.name}
                    </Button>
                  </Link>
                  <Link href="/profile/orders">
                    <Button variant="ghost" size="sm">
                      Siparişlerim
                    </Button>
                  </Link>
                  <Link href="/profile/addresses">
                    <Button variant="ghost" size="sm">
                      Adreslerim
                    </Button>
                  </Link>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button variant="ghost" size="icon" type="submit">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Çıkış</span>
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Giriş</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

