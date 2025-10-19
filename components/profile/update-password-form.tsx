"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateUserPassword } from "@/actions/profile";
import { Lock, Check, AlertCircle, Shield } from "lucide-react";

export function UpdatePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Hata",
        description: "Şifre en az 6 karakter olmalıdır",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const result = await updateUserPassword(currentPassword, newPassword);

    if (result.success) {
      toast({
        title: "Başarılı! ✓",
        description: "Şifreniz güncellendi",
        variant: "success" as any,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast({
        title: "Hata",
        description: result.error || "Bir hata oluştu",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordLengthValid = newPassword.length >= 6;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-gray-700 font-medium flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          Mevcut Şifre
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            onFocus={() => setFocusedField('current')}
            onBlur={() => setFocusedField(null)}
            className={`pl-11 h-12 border-2 transition-all duration-300 ${
              focusedField === 'current' 
                ? 'border-primary shadow-lg ring-4 ring-primary/10' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
          />
          <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            focusedField === 'current' ? 'text-primary' : 'text-gray-400'
          }`} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-gray-700 font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Yeni Şifre
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="En az 6 karakter"
            required
            minLength={6}
            onFocus={() => setFocusedField('new')}
            onBlur={() => setFocusedField(null)}
            className={`pl-11 h-12 border-2 transition-all duration-300 ${
              focusedField === 'new' 
                ? 'border-primary shadow-lg ring-4 ring-primary/10' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
          />
          <Shield className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            focusedField === 'new' ? 'text-primary' : 'text-gray-400'
          }`} />
        </div>
        {newPassword && (
          <div className="flex items-center gap-1.5 text-xs animate-fadeInUp">
            {passwordLengthValid ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <AlertCircle className="h-3 w-3 text-amber-600" />
            )}
            <span className={passwordLengthValid ? "text-green-600" : "text-amber-600"}>
              {passwordLengthValid ? "Şifre uzunluğu yeterli" : "En az 6 karakter gerekli"}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          Yeni Şifre (Tekrar)
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            onFocus={() => setFocusedField('confirm')}
            onBlur={() => setFocusedField(null)}
            className={`pl-11 h-12 border-2 transition-all duration-300 ${
              focusedField === 'confirm' 
                ? 'border-primary shadow-lg ring-4 ring-primary/10' 
                : 'border-gray-200 hover:border-primary/50'
            }`}
          />
          <Check className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
            focusedField === 'confirm' ? 'text-primary' : 'text-gray-400'
          }`} />
        </div>
        {confirmPassword && (
          <div className="flex items-center gap-1.5 text-xs animate-fadeInUp">
            {passwordsMatch ? (
              <>
                <Check className="h-3 w-3 text-green-600" />
                <span className="text-green-600">Şifreler eşleşiyor</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-red-600" />
                <span className="text-red-600">Şifreler eşleşmiyor</span>
              </>
            )}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={loading || !passwordsMatch || !passwordLengthValid}
        className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Güncelleniyor...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Şifreyi Güncelle
          </>
        )}
      </Button>
    </form>
  );
}

