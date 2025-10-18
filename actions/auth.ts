"use server";

import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Tüm alanları doldurunuz" };
  }

  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır" };
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Bu e-posta adresi zaten kullanımda" };
  }

  // Hash password
  const password_hash = await hash(password, 10);

  // Create user
  await db.user.create({
    data: {
      name,
      email,
      password_hash,
      role: "CUSTOMER",
    },
  });

  // Auto sign in after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Kayıt başarılı ancak giriş yapılamadı" };
    }
  }

  redirect("/");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "E-posta ve şifre gereklidir" };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.error) {
      // Check user role to determine redirect path
      const user = await db.user.findUnique({
        where: { email },
        select: { role: true },
      });

      if (user?.role === "ADMIN") {
        redirect("/admin");
      } else {
        redirect("/");
      }
    }

    return { error: "Geçersiz e-posta veya şifre" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Geçersiz e-posta veya şifre" };
        default:
          return { error: "Bir hata oluştu" };
      }
    }
    throw error;
  }
}

