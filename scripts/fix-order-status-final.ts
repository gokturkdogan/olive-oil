import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing order statuses...");
  
  // First add PAID back to enum temporarily
  await prisma.$executeRaw`
    ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAID';
  `;
  
  // Update PAID to CONFIRMED
  const result = await prisma.$executeRaw`
    UPDATE "orders" 
    SET status = 'CONFIRMED'::text::"OrderStatus"
    WHERE status = 'PAID'::text::"OrderStatus"
  `;
  
  console.log(`Updated ${result} orders from PAID to CONFIRMED`);
  
  // Update FULFILLED to DELIVERED
  const result2 = await prisma.$executeRaw`
    UPDATE "orders" 
    SET status = 'DELIVERED'::text::"OrderStatus"
    WHERE status = 'FULFILLED'::text::"OrderStatus"
  `;
  
  console.log(`Updated ${result2} orders from FULFILLED to DELIVERED`);
  
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
