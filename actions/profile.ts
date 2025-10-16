"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";

/**
 * Kullanıcı adını günceller
 */
export async function updateUserName(name: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Giriş yapmalısınız" };
    }

    if (!name || name.trim().length < 2) {
      return { success: false, error: "Geçerli bir isim giriniz" };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update name error:", error);
    return { success: false, error: "İsim güncellenemedi" };
  }
}

/**
 * Kullanıcı şifresini değiştirir
 */
export async function updateUserPassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Giriş yapmalısınız" };
    }

    if (!currentPassword || !newPassword) {
      return { success: false, error: "Tüm alanları doldurunuz" };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Yeni şifre en az 6 karakter olmalıdır" };
    }

    // Get current user
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password_hash) {
      return { success: false, error: "Kullanıcı bulunamadı" };
    }

    // Verify current password
    const isValid = await compare(currentPassword, user.password_hash);

    if (!isValid) {
      return { success: false, error: "Mevcut şifre yanlış" };
    }

    // Hash new password
    const newPasswordHash = await hash(newPassword, 10);

    // Update password
    await db.user.update({
      where: { id: session.user.id },
      data: { password_hash: newPasswordHash },
    });

    return { success: true };
  } catch (error) {
    console.error("Update password error:", error);
    return { success: false, error: "Şifre güncellenemedi" };
  }
}

