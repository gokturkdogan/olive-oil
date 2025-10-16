# Zeytinyağı E-Ticaret - Kurulum Kılavuzu

Bu dokümanda projeyi sıfırdan nasıl kuracağınızı adım adım bulacaksınız.

## 📋 Ön Koşullar

✅ Node.js 18.18 veya üzeri  
✅ PostgreSQL 14 veya üzeri  
✅ npm veya yarn  
✅ Git  

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın

\`\`\`bash
git clone <repository-url>
cd zeytin-yagi
\`\`\`

### 2. Bağımlılıkları Kurun

\`\`\`bash
npm install
\`\`\`

### 3. Veritabanını Hazırlayın

#### Seçenek A: Neon (Cloud PostgreSQL - Önerilen)

1. [Neon.tech](https://neon.tech) hesabı oluşturun
2. Yeni bir PostgreSQL database oluşturun
3. Connection string'i kopyalayın (örnek: \`postgresql://user:pass@host.neon.tech/dbname\`)

#### Seçenek B: Lokal PostgreSQL

\`\`\`bash
# PostgreSQL servisini başlatın
sudo service postgresql start

# Database oluşturun
createdb zeytinyagi
\`\`\`

### 4. Ortam Değişkenlerini Ayarlayın

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

\`.env.local\` dosyasını düzenleyin:

\`\`\`env
# Veritabanı bağlantı string'i
DATABASE_URL="postgresql://user:password@localhost:5432/zeytinyagi"

# Auth secret (üretin: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generated-secret-key-here"

# İyzico (Sandbox için test değerleri)
IYZICO_API_KEY="sandbox-api-key"
IYZICO_SECRET_KEY="sandbox-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
\`\`\`

### 5. Veritabanı Migration ve Seed

\`\`\`bash
# Migration'ları çalıştırın
npx prisma migrate dev --name init

# Prisma Client oluşturun
npx prisma generate

# Seed data ekleyin (demo ürünler, admin, kuponlar)
npm run db:seed
\`\`\`

### 6. Geliştirme Sunucusunu Başlatın

\`\`\`bash
npm run dev
\`\`\`

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır! 🎉

## 🔑 Varsayılan Kullanıcılar (Seed Data)

### Admin Kullanıcı
- **E-posta:** admin@zeytinyagi.com  
- **Şifre:** admin123  
- **Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

### Müşteri Kullanıcı
- **E-posta:** musteri@zeytinyagi.com  
- **Şifre:** customer123

### Demo Kuponlar
- **HOSGELDIN20** - %20 indirim (min. 100 TL)
- **YILBASI50** - 50 TL sabit indirim (min. 200 TL)

## 🏗️ İyzico Entegrasyonu

### Sandbox (Test) Modunda Çalışma

1. [İyzico Developer Portal](https://sandbox-merchant.iyzipay.com) hesabı oluşturun
2. API Key ve Secret Key alın
3. \`.env.local\` dosyasına ekleyin

### Test Kartları

**Başarılı Ödeme:**
- Kart No: 5890040000000016
- Son Kullanma: 12/30
- CVV: 123
- 3D Secure: 123456

**Başarısız Ödeme:**
- Kart No: 5406670000000009
- Son Kullanma: 12/30
- CVV: 123

### Production'a Geçiş

\`\`\`env
IYZICO_API_KEY="production-api-key"
IYZICO_SECRET_KEY="production-secret-key"
IYZICO_BASE_URL="https://api.iyzipay.com"
\`\`\`

## 📊 Prisma Studio (Database GUI)

Veritabanını görsel olarak yönetmek için:

\`\`\`bash
npx prisma studio
\`\`\`

[http://localhost:5555](http://localhost:5555) adresinde açılır.

## 🐛 Yaygın Sorunlar ve Çözümler

### Problem: "Can't reach database server"

**Çözüm:**
- PostgreSQL servisinizin çalıştığından emin olun
- \`DATABASE_URL\`'nin doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin

### Problem: "Module not found" hatası

**Çözüm:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Problem: Prisma type hatası

**Çözüm:**
\`\`\`bash
npx prisma generate
\`\`\`

### Problem: "NEXTAUTH_SECRET eksik" hatası

**Çözüm:**
\`\`\`bash
# Secret key oluştur
openssl rand -base64 32

# .env.local'e ekle
NEXTAUTH_SECRET="generated-key"
\`\`\`

## 🔄 Veritabanını Sıfırlama

**⚠️ DİKKAT:** Bu işlem tüm verileri siler!

\`\`\`bash
# Tüm verileri sil ve migration'ları yeniden çalıştır
npx prisma migrate reset

# Seed data'yı tekrar yükle
npm run db:seed
\`\`\`

## 📦 Production Build

\`\`\`bash
# Build oluştur
npm run build

# Production modda çalıştır
npm start
\`\`\`

## 🚀 Vercel'e Deploy

1. Projeyi GitHub'a push'layın
2. [Vercel](https://vercel.com) hesabınızı bağlayın
3. Projeyi import edin
4. Environment variables ekleyin:
   - \`DATABASE_URL\`
   - \`NEXTAUTH_URL\` (https://yourdomain.com)
   - \`NEXTAUTH_SECRET\`
   - \`IYZICO_API_KEY\`
   - \`IYZICO_SECRET_KEY\`
   - \`IYZICO_BASE_URL\`
5. Deploy!

## 📝 Sonraki Adımlar

- [ ] Production veritabanı kurun (Neon/Vercel Postgres)
- [ ] Domain bağlayın
- [ ] İyzico production keys ekleyin
- [ ] E-posta servisi ekleyin (Resend)
- [ ] Analytics ekleyin (Google Analytics/Vercel Analytics)
- [ ] Error tracking ekleyin (Sentry)

## 🆘 Yardım

Sorun yaşarsanız:
1. Bu dokümandaki "Yaygın Sorunlar" bölümüne bakın
2. GitHub Issues'da arayın
3. Yeni issue açın

---

**İyi geliştirmeler! 🎉**

