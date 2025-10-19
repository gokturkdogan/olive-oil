# 🚀 Vercel Deploy Kılavuzu

## Gereksinimler

- [Vercel Hesabı](https://vercel.com)
- GitHub/GitLab/Bitbucket repository
- Neon PostgreSQL database
- İyzico hesabı (opsiyonel - geliştirme aşaması için)
- Resend hesabı (opsiyonel - mail gönderimi için)

## Adım 1: Repository'yi GitHub'a Push Edin

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Adım 2: Vercel'e Projeyi Import Edin

1. https://vercel.com adresine gidin
2. "Add New" > "Project" tıklayın
3. GitHub repository'nizi seçin
4. Framework Preset: **Next.js** (otomatik seçilecek)

## Adım 3: Environment Variables Ekleyin

Vercel'de **Environment Variables** bölümüne şu değişkenleri ekleyin:

### Zorunlu Değişkenler

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### İyzico (Ödeme Sistemi)

```
IYZICO_API_KEY=your-api-key
IYZICO_SECRET_KEY=your-secret-key
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```

### Resend (Mail Sistemi) - Opsiyonel

```
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=onboarding@resend.dev
```

## Adım 4: Build & Deploy

1. "Deploy" butonuna tıklayın
2. Build süreci başlayacak
3. Deploy başarılı olduğunda URL'nizi alacaksınız

## Adım 5: Database Migration (İlk Deploy)

İlk deploy'dan sonra Prisma migration'larını çalıştırın:

1. Vercel Dashboard > Settings > Functions
2. Terminal açın veya deployment log'larını kontrol edin
3. Otomatik migration çalışmazsa manuel olarak:

```bash
# Local'de production database'e migrate yapın
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

## Adım 6: İyzico Callback URL'ini Güncelleyin

Production'da callback URL'i güncelleyin:

- Sandbox: `https://your-domain.vercel.app/api/iyzico/callback`
- Production: Canlı domain'inizi kullanın

## Önemli Notlar

### NEXTAUTH_SECRET Oluşturma

```bash
openssl rand -base64 32
```

### Domain Ayarları

1. Vercel'de kendi domain'inizi ekleyin
2. `NEXTAUTH_URL` değişkenini domain'inize göre güncelleyin
3. İyzico callback URL'lerini güncelleyin

### Database Seeding (Opsiyonel)

Production'da örnek ürünler eklemek için:

```bash
DATABASE_URL="your-production-db-url" npm run db:seed
```

## Build Ayarları (Otomatik)

Vercel otomatik olarak şunları yapacak:

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `npm run dev`

## Sorun Giderme

### Build Hatası Alırsanız

1. Local'de build test edin: `npm run build`
2. Linter hatalarını düzeltin: `npm run lint`
3. Environment variables'ları kontrol edin

### Database Bağlantı Hatası

1. Neon database URL'ini kontrol edin
2. SSL mode eklenmiş mi? `?sslmode=require`
3. IP whitelist kontrol edin (Neon → Settings)

### Mail Gönderilmiyor

- Resend API key doğru mu?
- Resend'de domain doğrulaması yapıldı mı?
- Environment variables Production'a eklendi mi?

## Continuous Deployment

Her `git push` yaptığınızda Vercel otomatik deploy yapacak:

- `main` branch → Production
- Diğer branch'ler → Preview deployment

## İzleme

- Vercel Dashboard'dan deployment loglarını takip edin
- Analytics için Vercel Analytics aktive edin
- Error tracking için Sentry ekleyebilirsiniz

---

**Deploy başarılı olduğunda siteye şuradan erişebilirsiniz:**
`https://your-project.vercel.app`

🎉 Başarılar!

