import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {


  // Create admin user
  const adminPassword = await hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@zeytinyagi.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@zeytinyagi.com",
      password_hash: adminPassword,
      role: "ADMIN",
    },
  });


  // Create customer user
  const customerPassword = await hash("customer123", 10);
  const customer = await prisma.user.upsert({
    where: { email: "musteri@zeytinyagi.com" },
    update: {},
    create: {
      name: "Müşteri User",
      email: "musteri@zeytinyagi.com",
      password_hash: customerPassword,
      role: "CUSTOMER",
    },
  });


  // Create products
  const product1 = await prisma.product.upsert({
    where: { slug: "sizma-zeytinyagi-500ml" },
    update: {},
    create: {
      slug: "sizma-zeytinyagi-500ml",
      title: "Sızma Zeytinyağı 500ml",
      description:
        "Ege bölgesinin verimli topraklarında yetişen zeytinlerden, soğuk sıkım yöntemiyle elde edilen birinci sınıf sızma zeytinyağı. %0.5'den düşük asit oranı ile sağlığınız için en iyi seçim. Antioksidan bakımından zengin, kalp dostu, tamamen doğal ve katkısız. Cam şişede, ışık geçirmez ambalajda.",
      images: JSON.stringify(["/images/zeytinyagi-500ml.jpg"]),
      price: 15000, // 150 TL
      stock: 100,
      active: true,
    },
  });


  const product2 = await prisma.product.upsert({
    where: { slug: "sizma-zeytinyagi-1l" },
    update: {},
    create: {
      slug: "sizma-zeytinyagi-1l",
      title: "Sızma Zeytinyağı 1L",
      description:
        "Ekonomik 1 litrelik şişede premium kalite sızma zeytinyağı. Ailenizin günlük ihtiyaçları için ideal boyut. Soğuk sıkım, %100 doğal, laboratuvar testli. Salatalarda, yemeklerde ve kahvaltıda güvenle kullanabilirsiniz.",
      images: JSON.stringify(["/images/zeytinyagi-1l.jpg"]),
      price: 28000, // 280 TL
      stock: 75,
      active: true,
    },
  });


  const product3 = await prisma.product.upsert({
    where: { slug: "sizma-zeytinyagi-5l" },
    update: {},
    create: {
      slug: "sizma-zeytinyagi-5l",
      title: "Sızma Zeytinyağı 5L",
      description:
        "Toplu alım için en uygun seçenek. 5 litrelik teneke ambalajda, uzun süre taze kalır. Restoran, otel ve toplu tüketim için idealdir. Aynı kalitede, daha ekonomik fiyat.",
      images: JSON.stringify(["/images/zeytinyagi-5l.jpg"]),
      price: 125000, // 1250 TL
      stock: 30,
      active: true,
    },
  });


  // Create coupons
  const coupon1 = await prisma.coupon.upsert({
    where: { code: "HOSGELDIN20" },
    update: {},
    create: {
      code: "HOSGELDIN20",
      type: "PERCENTAGE",
      value: 20, // %20 indirim
      usage_limit: 100,
      used_count: 0,
      min_order_amount: 10000, // 100 TL minimum
      starts_at: new Date("2025-01-01"),
      ends_at: new Date("2025-12-31"),
      active: true,
    },
  });


  const coupon2 = await prisma.coupon.upsert({
    where: { code: "YILBASI50" },
    update: {},
    create: {
      code: "YILBASI50",
      type: "FIXED",
      value: 5000, // 50 TL sabit indirim
      usage_limit: 50,
      used_count: 0,
      min_order_amount: 20000, // 200 TL minimum
      starts_at: new Date("2024-12-01"),
      ends_at: new Date("2025-01-31"),
      active: true,
    },
  });


  // Create shipping settings
  const shippingSettings = await prisma.shippingSettings.findFirst();
  if (!shippingSettings) {
    await prisma.shippingSettings.create({
      data: {
        base_shipping_fee: 2500, // 25 TL
        free_shipping_threshold: 100000, // 1000 TL
        active: true,
      },
    });

  } else {

  }


}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

