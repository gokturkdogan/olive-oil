# Zeytinyağı E-Ticaret Platformu

Modern, full-stack zeytinyağı e-ticaret platformu. Next.js 15, Prisma, PostgreSQL ve İyzico entegrasyonu ile geliştirilmiştir.

## 🚀 Özellikler

### Müşteri Özellikleri
- ✅ Kullanıcı kayıt ve giriş sistemi (Auth.js)
- ✅ Ürün listeleme ve detay sayfaları
- ✅ Sepet yönetimi (guest ve login kullanıcılar için)
- ✅ Kupon kodu desteği (yüzde/sabit indirim)
- ✅ Güvenli ödeme (İyzico Checkout Form)
- ✅ Sipariş takibi
- ✅ Responsive tasarım (mobile-first)

### Admin Özellikleri
- ✅ Dashboard (genel bakış, istatistikler)
- ✅ Ürün yönetimi (stok, fiyat, açıklama)
- ✅ Sipariş yönetimi (durum takibi, kargo bilgileri)
- ✅ Kupon yönetimi (oluşturma, aktivasyon, kullanım limiti)

## 🛠️ Teknolojiler

- **Frontend:** Next.js 15 (App Router), React 19, TailwindCSS
- **Backend:** Next.js Route Handlers, Server Actions
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** Auth.js (NextAuth v5)
- **Payment:** İyzico Checkout Form
- **UI Components:** shadcn/ui + Radix UI
- **Form Validation:** Zod
- **Styling:** TailwindCSS v3

## 📋 Gereksinimler

- Node.js 18.18+
- PostgreSQL 14+
- npm veya yarn

## 🔧 Kurulum

### 1. Projeyi Klonlayın

\`\`\`bash
git clone <repository-url>
cd zeytin-yagi
\`\`\`

### 2. Bağımlılıkları Yükleyin

\`\`\`bash
npm install
\`\`\`

### 3. Veritabanını Ayarlayın

**Neon (Önerilen):**
1. [Neon](https://neon.tech) hesabı oluşturun
2. Yeni bir PostgreSQL database oluşturun
3. Connection string'i kopyalayın

**Lokal PostgreSQL:**
\`\`\`bash
createdb zeytinyagi
\`\`\`

### 4. Ortam Değişkenlerini Ayarlayın

\`\`\`bash
cp .env.example .env
\`\`\`

\`.env\` dosyasını düzenleyin:

\`\`\`env
DATABASE_URL="postgresql://user:password@host:5432/zeytinyagi"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32 ile oluşturun"
IYZICO_API_KEY="your-api-key"
IYZICO_SECRET_KEY="your-secret-key"
\`\`\`

### 5. Veritabanı Migration

\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

### 6. Seed Data (Opsiyonel)

\`\`\`bash
npx prisma db seed
\`\`\`

### 7. Geliştirme Sunucusunu Başlatın

\`\`\`bash
npm run dev
\`\`\`

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📁 Proje Yapısı

\`\`\`
zeytin-yagi/
├── app/                      # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── admin/               # Admin paneli
│   │   ├── products/
│   │   ├── orders/
│   │   └── coupons/
│   ├── products/            # Ürün sayfaları
│   ├── cart/                # Sepet
│   ├── checkout/            # Ödeme
│   ├── api/                 # API Routes
│   │   ├── auth/
│   │   └── iyzico/
│   └── ...
├── actions/                 # Server Actions
│   ├── auth.ts
│   ├── cart.ts
│   ├── orders.ts
│   └── products.ts
├── components/              # React Bileşenleri
│   ├── ui/                  # shadcn/ui components
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── ...
├── lib/                     # Utility Functions
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # Auth config
│   ├── money.ts             # Para hesaplamaları
│   ├── coupons.ts           # Kupon doğrulama
│   └── iyzico.ts            # İyzico SDK
├── prisma/
│   └── schema.prisma        # Veritabanı şeması
└── ...
\`\`\`

## 🗄️ Veritabanı Modeli

### Temel Modeller

- **User** - Kullanıcılar (müşteri/admin)
- **Product** - Ürünler
- **Cart** - Sepetler (user/guest)
- **CartItem** - Sepet ürünleri
- **Order** - Siparişler
- **OrderItem** - Sipariş ürünleri (snapshot)
- **Coupon** - İndirim kuponları
- **Webhook** - İyzico event log

## 💳 İyzico Entegrasyonu

### Test Kartları (Sandbox)

**Başarılı Ödeme:**
- Kart: 5890040000000016
- CVV: 123
- Tarih: 12/30

### Callback Flow

1. Kullanıcı checkout formunu doldurur
2. Server \`createCheckoutForm()\` ile İyzico'dan payment token alır
3. Kullanıcı İyzico ödeme sayfasına yönlendirilir
4. Ödeme tamamlanınca İyzico \`/api/iyzico/callback\` endpoint'ine POST yapar
5. Server ödemeyi doğrular, siparişi günceller, stokları düşer
6. Kullanıcı success sayfasına yönlendirilir

## 🔐 Güvenlik

- ✅ CSRF koruması (Server Actions)
- ✅ SQL Injection koruması (Prisma ORM)
- ✅ XSS koruması (React escape)
- ✅ Şifre hashleme (bcryptjs)
- ✅ Secure cookies (httpOnly, secure, sameSite)
- ✅ Server-side validation (Zod)
- ✅ Admin role kontrolü (middleware)

## 🚢 Deployment

### Vercel (Önerilen)

1. GitHub'a push yapın
2. [Vercel](https://vercel.com) hesabınızı bağlayın
3. Projeyi import edin
4. Environment variables ekleyin
5. Deploy edin

### Database

- **Neon:** Otomatik scaling, generous free tier
- **Vercel Postgres:** Vercel entegrasyonu
- **Supabase:** PostgreSQL + ek özellikler

### Ortam Değişkenleri (Production)

\`\`\`env
DATABASE_URL="your-production-db-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-key"
IYZICO_API_KEY="production-api-key"
IYZICO_SECRET_KEY="production-secret-key"
IYZICO_BASE_URL="https://api.iyzipay.com"
\`\`\`

## 📝 TODO (Post-MVP)

- [ ] E-posta bildirimleri (sipariş onayı, kargo takibi)
- [ ] Ürün varyantları (500ml, 1L, 5L)
- [ ] Fatura PDF oluşturma
- [ ] Admin: Ürün/kupon oluşturma formları
- [ ] Çoklu dil desteği (i18n)
- [ ] Blog/içerik yönetimi
- [ ] SEO optimizasyonu
- [ ] Google Analytics
- [ ] Rate limiting (Upstash)
- [ ] Error tracking (Sentry)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (\`git checkout -b feature/amazing-feature\`)
3. Commit yapın (\`git commit -m 'feat: Add amazing feature'\`)
4. Push yapın (\`git push origin feature/amazing-feature\`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙋 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Geliştirici:** Zeytinyağı E-Ticaret Ekibi
**Versiyon:** 1.0.0 (MVP)
