import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const GUEST_ID_COOKIE = "guest_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 yıl

/**
 * Misafir kullanıcı ID'sini alır (sadece okuma)
 */
export async function getGuestId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_ID_COOKIE)?.value || null;
}

/**
 * Misafir kullanıcı için benzersiz ID oluşturur (Server Action'da kullanılmalı)
 */
export async function setGuestId(): Promise<string> {
  const cookieStore = await cookies();
  const guestId = uuidv4();
  
  cookieStore.set(GUEST_ID_COOKIE, guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
  
  return guestId;
}

/**
 * Misafir ID'yi temizler (login sonrası)
 */
export async function clearGuestId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_ID_COOKIE);
}

