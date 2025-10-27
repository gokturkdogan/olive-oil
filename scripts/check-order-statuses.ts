import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking order statuses...");
  
  // Check if there are any orders with old status values
  const allOrders = await prisma.order.findMany({
    select: {
      id: true,
      status: true,
      payment_status: true,
    },
  });
  
  console.log(`Total orders: ${allOrders.length}`);
  
  const statusCounts = allOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\nStatus counts:");
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  
  const paymentStatusCounts = allOrders.reduce((acc, order) => {
    const ps = order.payment_status;
    acc[ps || "NULL"] = (acc[ps || "NULL"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\nPayment Status counts:");
  Object.entries(paymentStatusCounts).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
