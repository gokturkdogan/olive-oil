"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getGuestId, setGuestId } from "@/lib/cookies";
import { revalidatePath } from "next/cache";

/**
 * Kullanıcının sepetini getirir (kullanıcı veya guest)
 */
export async function getCart() {
  const session = await auth();

  let cart;

  if (session?.user?.id) {
    // Logged in user
    cart = await db.cart.findFirst({
      where: {
        user_id: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  } else {
    // Guest user
    let guestId = await getGuestId();
    
    if (guestId) {
      cart = await db.cart.findFirst({
        where: {
          guest_id: guestId,
          user_id: null,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }
  }

  return cart;
}

/**
 * Sepete ürün ekler
 */
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    if (quantity < 1) {
      return { success: false, error: "Geçersiz miktar" };
    }

    // Check if product exists and has stock
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.active) {
      return { success: false, error: "Ürün bulunamadı" };
    }

    if (product.stock < quantity) {
      return { success: false, error: "Yeterli stok yok" };
    }

    const session = await auth();
    let cart;

    if (session?.user?.id) {
      // Find or create user cart
      cart = await db.cart.findFirst({
        where: { user_id: session.user.id },
      });

      if (!cart) {
        cart = await db.cart.create({
          data: {
            user_id: session.user.id,
          },
        });
      }
    } else {
      // Guest cart
      let guestId = await getGuestId();
      
      if (!guestId) {
        guestId = await setGuestId();
      }

      cart = await db.cart.findFirst({
        where: {
          guest_id: guestId,
          user_id: null,
        },
      });

      if (!cart) {
        cart = await db.cart.create({
          data: {
            guest_id: guestId,
          },
        });
      }
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return { success: false, error: "Yeterli stok yok" };
      }

      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new item
      await db.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity,
        },
      });
    }

    revalidatePath("/cart");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: "Bir hata oluştu" };
  }
}

/**
 * Sepetten ürün siler
 */
export async function removeFromCart(itemId: string) {
  try {
    await db.cartItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/cart");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { success: false, error: "Bir hata oluştu" };
  }
}

/**
 * Sepetteki ürün miktarını günceller
 */
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    if (quantity < 1) {
      return await removeFromCart(itemId);
    }

    const item = await db.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) {
      return { success: false, error: "Ürün bulunamadı" };
    }

    if (item.product.stock < quantity) {
      return { success: false, error: "Yeterli stok yok" };
    }

    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    revalidatePath("/cart");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Update cart item error:", error);
    return { success: false, error: "Bir hata oluştu" };
  }
}

/**
 * Sepeti boşaltır
 */
export async function clearCart() {
  try {
    const cart = await getCart();

    if (cart) {
      await db.cartItem.deleteMany({
        where: { cart_id: cart.id },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Clear cart error:", error);
    return { success: false, error: "Bir hata oluştu" };
  }
}

/**
 * Guest sepetini kullanıcı sepetine birleştirir (login sonrası)
 */
export async function mergeGuestCart(userId: string, guestId: string) {
  try {
    // Get user cart
    let userCart = await db.cart.findFirst({
      where: { user_id: userId },
      include: { items: true },
    });

    // Get guest cart
    const guestCart = await db.cart.findFirst({
      where: {
        guest_id: guestId,
        user_id: null,
      },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return { success: true };
    }

    // Create user cart if doesn't exist
    if (!userCart) {
      userCart = await db.cart.create({
        data: {
          user_id: userId,
        },
        include: { items: true },
      });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItem = userCart.items.find(
        (item) => item.product_id === guestItem.product_id
      );

      if (existingItem) {
        // Update quantity
        await db.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + guestItem.quantity,
          },
        });
      } else {
        // Move item to user cart
        await db.cartItem.update({
          where: { id: guestItem.id },
          data: {
            cart_id: userCart.id,
          },
        });
      }
    }

    // Delete guest cart
    await db.cart.delete({
      where: { id: guestCart.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Merge cart error:", error);
    return { success: false, error: "Sepet birleştirilemedi" };
  }
}

