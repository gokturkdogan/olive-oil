"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/actions/logout";

interface NavbarProps {
  session: any;
  cartItemsCount: number;
}

export function NavbarClient({ session, cartItemsCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-2 md:p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Leaf className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Zeytinyağı</span>
              <span className="text-[9px] md:text-[10px] text-gray-600 font-medium -mt-0.5 tracking-wider">PREMIUM SIZMA</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                pathname === "/" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/products"
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                pathname.startsWith("/products")
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              Ürünler
            </Link>
            <Link
              href="/loyalty"
              className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                pathname === "/loyalty"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              Sadakat
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  pathname.startsWith("/admin")
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`relative rounded-xl transition-all duration-300 ${
                  pathname === "/cart"
                    ? "bg-green-100 text-green-700"
                    : "hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs border-2 border-white shadow-lg">
                    {cartItemsCount}
                  </Badge>
                )}
                <span className="sr-only">Sepet</span>
              </Button>
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-1">
                <Link href="/profile">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-lg transition-all duration-300 ${
                      pathname === "/profile"
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <User className="h-4 w-4 mr-1.5" />
                    {session.user.name}
                  </Button>
                </Link>
                <Link href="/profile/orders">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-lg transition-all duration-300 ${
                      pathname === "/profile/orders"
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    Siparişlerim
                  </Button>
                </Link>
                <Link href="/profile/addresses">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-lg transition-all duration-300 ${
                      pathname === "/profile/addresses"
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    Adreslerim
                  </Button>
                </Link>
                <form action={handleLogout}>
                  <Button variant="ghost" size="icon" type="submit" className="rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Çıkış</span>
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <User className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-9 w-9 rounded-lg relative transition-all duration-300 ${
                  pathname === "/cart"
                    ? "bg-green-100 text-green-700"
                    : "hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs border-2 border-white">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-green-50 hover:text-green-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-gray-200 animate-fadeInUp bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`mx-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  pathname === "/" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                className={`mx-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  pathname.startsWith("/products")
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Ürünler
              </Link>
              <Link
                href="/loyalty"
                className={`mx-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  pathname === "/loyalty"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sadakat
              </Link>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`mx-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="h-px bg-gray-200 my-2"></div>
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    className={`mx-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center ${
                      pathname === "/profile"
                        ? "bg-green-100 text-green-700"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {session.user.name}
                  </Link>
                  <Link
                    href="/profile/orders"
                    className={`mx-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      pathname === "/profile/orders"
                        ? "bg-green-100 text-green-700"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Siparişlerim
                  </Link>
                  <Link
                    href="/profile/addresses"
                    className={`mx-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      pathname === "/profile/addresses"
                        ? "bg-green-100 text-green-700"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Adreslerim
                  </Link>
                  <form action={handleLogout} className="px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="submit"
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </form>
                </>
              ) : (
                <div className="px-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-lg">
                      <User className="h-4 w-4 mr-2" />
                      Giriş Yap
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

