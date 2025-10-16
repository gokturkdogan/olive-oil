"use server";

import { db } from "@/lib/db";

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: {
        slug,
        active: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

