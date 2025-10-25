"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { markRefundCompleted } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";

interface MarkRefundCompletedButtonProps {
  orderId: string;
}

export function MarkRefundCompletedButton({ orderId }: MarkRefundCompletedButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMarkCompleted = async () => {
    setIsLoading(true);
    
    try {
      const result = await markRefundCompleted(orderId);
      
      if (result.success) {
        toast({
          title: "Başarılı!",
          description: "İade tamamlandı olarak işaretlendi.",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        toast({
          title: "Hata!",
          description: result.error || "Bir hata oluştu.",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Bir hata oluştu.",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleMarkCompleted}
      disabled={isLoading}
      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed"
    >
      <CheckCircle className="h-4 w-4" />
      {isLoading ? "İşleniyor..." : "İade Ettim"}
    </button>
  );
}
