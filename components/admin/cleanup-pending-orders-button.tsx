"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, CheckCircle } from "lucide-react";

interface CleanupPendingOrdersButtonProps {
  pendingCount: number;
}

export function CleanupPendingOrdersButton({ pendingCount }: CleanupPendingOrdersButtonProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCleanup = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/cleanup-pending-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Başarılı! ✓",
          description: `${result.deletedCount} adet PENDING order temizlendi`,
          variant: "success",
        });
        setCompleted(true);
        // Sayfayı yenile
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        toast({
          title: "Hata",
          description: result.error || "Temizleme başarısız",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      toast({
        title: "Hata",
        description: "Temizleme işlemi başarısız",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-semibold">Temizlendi</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleCleanup}
      disabled={loading}
      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 font-semibold px-4 py-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Temizleniyor...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Temizle ({pendingCount})
        </>
      )}
    </Button>
  );
}