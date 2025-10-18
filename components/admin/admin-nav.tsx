"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, Tag, Menu, X } from "lucide-react";

const navItems = [
  {
    href: "/admin",
    label: "Genel Bakış",
    icon: LayoutDashboard,
    exactMatch: true,
  },
  {
    href: "/admin/products",
    label: "Ürünler",
    icon: Package,
    exactMatch: false,
  },
  {
    href: "/admin/orders",
    label: "Siparişler",
    icon: ShoppingCart,
    exactMatch: false,
  },
  {
    href: "/admin/coupons",
    label: "Kuponlar",
    icon: Tag,
    exactMatch: false,
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string, exactMatch: boolean) => {
    if (exactMatch) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-2">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exactMatch);
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? "default" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 transition-all duration-300 ${
                  active
                    ? "bg-olive-gradient text-white shadow-md"
                    : "hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation Toggle */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-9 w-9"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden z-50">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exactMatch);
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      className={`w-full justify-start gap-2 transition-all duration-300 ${
                        active
                          ? "bg-olive-gradient text-white shadow-md"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

