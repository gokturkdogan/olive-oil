import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating PAID orders to CONFIRMED...");
  
  // Update PAID status to CONFIRMED
  const result = await prisma.order.updateMany({
    where: { status: "PAID" },
    data: { status: "CONFIRMED" },
  });
  
  console.log(`Updated ${result.count} orders from PAID to CONFIRMED`);
  
  // Update FULFILLED status to DELIVERED
  const result2 = await prisma.order.updateMany({
    where: { status: "FULFILLED" },
    data: { status: "DELIVERED" },
  });
  
  console.log(`Updated ${result2.count} orders from FULFILLED to DELIVERED`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
