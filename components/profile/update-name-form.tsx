"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateUserName } from "@/actions/profile";
import { User, Save } from "lucide-react";

export function UpdateNameForm({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateUserName(name);

    if (result.success) {
      toast({
        title: "Başarılı! ✓",
        description: "İsminiz güncellendi",
        variant: "success" as any,
      });
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Bir hata oluştu",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const isChanged = name !== currentName;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Ad Soyad
        </Label>
        <div className="relative">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad Soyad"
            required
            onFocus={() => setFocusedField(true)}
            onBlur={() => setFocusedField(false)}
            className={`pl-11 h-12 border-2 transition-all duration-300 ${
              focusedField 
                ? 'border-primary shadow-lg ring-4 ring-primary/10' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
          />
          <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            focusedField ? 'text-primary' : 'text-gray-400'
          }`} />
        </div>
        {isChanged && (
          <p className="text-xs text-primary flex items-center gap-1.5 animate-fadeInUp">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Değişiklikler kaydedilmedi
          </p>
        )}
      </div>
      <Button 
        type="submit" 
        disabled={loading || !isChanged}
        className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Kaydediliyor...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Değişiklikleri Kaydet
          </>
        )}
      </Button>
    </form>
  );
}

