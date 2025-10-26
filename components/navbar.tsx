"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Leaf, Menu, X, Star, Award, Gem, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/actions/logout";
import { CategoryDropdown } from "@/components/category-dropdown";

interface NavbarProps {
  session: any;
  cartItemsCount: number;
  loyaltyTier?: string | null;
}

export function NavbarClient({ session, cartItemsCount, loyaltyTier }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Get loyalty tier badge
  const getLoyaltyBadge = () => {
    if (!loyaltyTier || loyaltyTier === "STANDARD") return null;

    const badges = {
      GOLD: { icon: Award, color: "from-amber-500 to-yellow-600", text: "GOLD" },
      PLATINUM: { icon: Gem, color: "from-slate-500 to-gray-600", text: "PLATINUM" },
      DIAMOND: { icon: Crown, color: "from-blue-500 to-cyan-600", text: "DIAMOND" },
    };

    const badge = badges[loyaltyTier as keyof typeof badges];
    if (!badge) return null;

    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${badge.color} shadow-md animate-pulse`}>
        <Icon className="h-3 w-3" />
        {badge.text}
      </span>
    );
  };

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
              <span className="text-lg md:text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Liva Oil</span>
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
            <CategoryDropdown pathname={pathname} onLinkClick={undefined} />
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
                    <span>{session.user.name}</span>
                    {getLoyaltyBadge()}
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
              <div className="mx-2">
                <CategoryDropdown pathname={pathname} onLinkClick={() => setMobileMenuOpen(false)} />
              </div>
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
                    <span className="flex items-center gap-2">
                      {session.user.name}
                      {getLoyaltyBadge()}
                    </span>
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

