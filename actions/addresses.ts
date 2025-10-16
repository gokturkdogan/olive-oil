"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Kullanıcının tüm adreslerini getirir
 */
export async function getUserAddresses() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return [];
    }

    const addresses = await db.address.findMany({
      where: { user_id: session.user.id },
      orderBy: [{ is_default: "desc" }, { created_at: "desc" }],
    });

    return addresses;
  } catch (error) {
    console.error("Get addresses error:", error);
    return [];
  }
}

/**
 * Yeni adres ekler
 */
export async function createAddress(data: {
  title: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault?: boolean;
}) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Giriş yapmalısınız" };
    }

    // If this is set as default, unset others
    if (data.isDefault) {
      await db.address.updateMany({
        where: { user_id: session.user.id, is_default: true },
        data: { is_default: false },
      });
    }

    await db.address.create({
      data: {
        user_id: session.user.id,
        title: data.title,
        name: data.name,
        phone: data.phone,
        address_line1: data.addressLine1,
        address_line2: data.addressLine2 || null,
        city: data.city,
        district: data.district,
        postal_code: data.postalCode,
        country: "TR",
        is_default: data.isDefault || false,
      },
    });

    revalidatePath("/profile/addresses");
    return { success: true };
  } catch (error) {
    console.error("Create address error:", error);
    return { success: false, error: "Adres eklenemedi" };
  }
}

/**
 * Adresi siler
 */
export async function deleteAddress(addressId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Giriş yapmalısınız" };
    }

    // Verify ownership
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.user_id !== session.user.id) {
      return { success: false, error: "Adres bulunamadı" };
    }

    await db.address.delete({
      where: { id: addressId },
    });

    revalidatePath("/profile/addresses");
    return { success: true };
  } catch (error) {
    console.error("Delete address error:", error);
    return { success: false, error: "Adres silinemedi" };
  }
}

/**
 * Varsayılan adresi ayarlar
 */
export async function setDefaultAddress(addressId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Giriş yapmalısınız" };
    }

    // Unset all defaults
    await db.address.updateMany({
      where: { user_id: session.user.id, is_default: true },
      data: { is_default: false },
    });

    // Set new default
    await db.address.update({
      where: { id: addressId, user_id: session.user.id },
      data: { is_default: true },
    });

    revalidatePath("/profile/addresses");
    return { success: true };
  } catch (error) {
    console.error("Set default address error:", error);
    return { success: false, error: "Varsayılan adres ayarlanamadı" };
  }
}

