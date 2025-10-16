"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { handleLogout } from "@/actions/logout";

interface NavbarProps {
  session: any;
}

export function NavbarClient({ session }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 glass shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-olive-gradient p-1.5 md:p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Leaf className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-gradient">Zeytinyağı</span>
              <span className="text-[10px] md:text-xs text-muted-foreground -mt-1">Premium Sızma</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="relative text-sm font-medium text-foreground hover:text-primary transition-all duration-300 group"
            >
              Ana Sayfa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/products"
              className="relative text-sm font-medium text-foreground hover:text-primary transition-all duration-300 group"
            >
              Ürünler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="relative text-sm font-medium text-foreground hover:text-primary transition-all duration-300 group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Sepet</span>
              </Button>
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    <User className="h-4 w-4 mr-2" />
                    {session.user.name}
                  </Button>
                </Link>
                <Link href="/profile/orders">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    Siparişlerim
                  </Button>
                </Link>
                <Link href="/profile/addresses">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    Adreslerim
                  </Button>
                </Link>
                <form action={handleLogout}>
                  <Button variant="ghost" size="icon" type="submit" className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Çıkış</span>
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-olive-gradient hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
                  <User className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/10 animate-fadeInUp">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ürünler
              </Link>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="h-px bg-primary/10 my-2"></div>
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {session.user.name}
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Siparişlerim
                  </Link>
                  <Link
                    href="/profile/addresses"
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Adreslerim
                  </Link>
                  <form action={handleLogout} className="px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      type="submit"
                      className="w-full justify-start text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </form>
                </>
              ) : (
                <div className="px-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-olive-gradient hover:opacity-90">
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

