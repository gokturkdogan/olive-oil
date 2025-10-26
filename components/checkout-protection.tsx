// components/checkout-protection.tsx - Checkout koruma component'i

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutProtectionProps {
  userEmail?: string | null;
  userId?: string | null;
}

export function CheckoutProtection({ userEmail, userId }: CheckoutProtectionProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Sadece production'da çalıştır
      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
        e.returnValue = "Ödeme işleminiz devam ediyor. Sayfadan ayrılmak istediğinizden emin misiniz?";
        return e.returnValue;
      }
    };

    const handleRouteChange = async () => {
      if (!isLeaving) {
        setIsLeaving(true);
        
        // Kullanıcının PENDING order'larını temizle
        try {
          const response = await fetch("/api/admin/cleanup-pending-orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail,
              userId,
              cleanupUser: true
            })
          });
          
          if (response.ok) {

          }
        } catch (error) {
          console.error("❌ Order temizleme hatası:", error);
        }
      }
    };

    // Beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLeaving, userEmail, userId]);

  return null; // Bu component görünmez
}
