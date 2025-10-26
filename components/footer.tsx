import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Liva Oil</h3>
            <p className="text-sm text-muted-foreground">
              Doğal, sağlıklı ve kaliteli zeytinyağı ile sofralarınıza lezzet
              katıyoruz.
            </p>
          </div>

          {/* Ürünler */}
          <div className="space-y-4">
            <h4 className="font-semibold">Ürünler</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary">
                  Sızma Zeytinyağı
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Kurumsal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Yasal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary">
                  Kargo & İade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Zeytinyağı. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

