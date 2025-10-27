import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating PAID orders to CONFIRMED...");
  
  // Update PAID status to CONFIRMED using raw SQL
  const result = await prisma.$executeRaw`
    UPDATE "orders" 
    SET status = 'CONFIRMED' 
    WHERE status = 'PAID'
  `;
  
  console.log(`Updated ${result} orders from PAID to CONFIRMED`);
  
  // Update FULFILLED status to DELIVERED
  const result2 = await prisma.$executeRaw`
    UPDATE "orders" 
    SET status = 'DELIVERED' 
    WHERE status = 'FULFILLED'
  `;
  
  console.log(`Updated ${result2} orders from FULFILLED to DELIVERED`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
