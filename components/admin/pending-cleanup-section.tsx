"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface PendingCleanupSectionProps {
  oldPendingOrders: number;
}

export function PendingCleanupSection({ oldPendingOrders }: PendingCleanupSectionProps) {
  const [loading, setLoading] = useState(false);

  const handleCleanup = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/cleanup-pending-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (oldPendingOrders === 0) return null;

  return (
    <div className="mt-8">
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
        <CardHeader className="bg-gradient-to-br from-amber-50/50 to-orange-50/50">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            PENDING Order Temizleme
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-amber-700">{oldPendingOrders}</span> adet 30 dakikadan eski PENDING order bulundu.
              </p>
              <p className="text-xs text-gray-600">
                Bu order'lar muhtemelen ödeme yapılmadan kalmış. Temizlenebilir.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCleanup}
                disabled={loading}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 font-semibold"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Temizleniyor...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Temizle
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

