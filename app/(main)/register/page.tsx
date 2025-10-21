"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, User, UserPlus, Sparkles, ArrowRight, AlertCircle, Check } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await register(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Success case handled by server action redirect
    } catch (err: any) {
      // Next.js redirect() throws a special error with 'digest' property
      // This is expected behavior - don't show error message for redirects
      if (err && typeof err === 'object' && 'digest' in err) {
        // This is a redirect, do nothing - let it happen
        return;
      }
      
      // Only show error for actual errors
      setError("Bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-300/10 to-emerald-300/10 rounded-full blur-3xl"></div>
      
      {/* Floating olive icons */}
      <div className="absolute top-20 left-[15%] text-6xl animate-float hidden md:block opacity-30">
        🫒
      </div>
      <div className="absolute bottom-32 right-[10%] text-7xl animate-float hidden md:block opacity-30" style={{ animationDelay: '2s' }}>
        🫒
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Welcome Badge */}
        <div className="text-center mb-8 animate-fadeInUp">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/30 px-5 py-2.5 text-sm font-semibold">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Yeni Üyelik
          </Badge>
        </div>

        <Card className="border-2 border-green-100 shadow-2xl shadow-green-500/10 bg-white hover:shadow-3xl hover:border-green-200 transition-all duration-500 animate-fadeInUp overflow-hidden">
          <CardHeader className="space-y-3 pb-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 transform hover:scale-110 hover:rotate-3 transition-all duration-300">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Kayıt Ol
              </span>
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Yeni hesap oluşturmak için bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3 animate-fadeInUp shadow-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}
              
              <div className="space-y-2 group">
                <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-green-600" />
                  Ad Soyad
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ahmet Yılmaz"
                    required
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-11 h-12 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'name' 
                        ? 'border-green-500 shadow-lg shadow-green-500/20 ring-4 ring-green-500/10' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  />
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    focusedField === 'name' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-green-600" />
                  E-posta Adresi
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ornek@email.com"
                    required
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-11 h-12 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'email' 
                        ? 'border-green-500 shadow-lg shadow-green-500/20 ring-4 ring-green-500/10' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  />
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-gray-700 font-semibold flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-green-600" />
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="En az 6 karakter"
                    required
                    minLength={6}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-11 h-12 border-2 rounded-xl transition-all duration-300 ${
                      focusedField === 'password' 
                        ? 'border-green-500 shadow-lg shadow-green-500/20 ring-4 ring-green-500/10' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  />
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    focusedField === 'password' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                  <Check className="h-3 w-3 text-green-600" />
                  Minimum 6 karakter kullanın
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 space-y-2 border-2 border-green-100">
                <p className="text-sm font-semibold text-gray-800 mb-2">✨ Üyelik Avantajları</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs text-gray-700">
                    <div className="bg-green-500 p-1 rounded-full flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">Hızlı ve güvenli alışveriş</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-700">
                    <div className="bg-green-500 p-1 rounded-full flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">Özel kampanya ve indirimler</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-700">
                    <div className="bg-green-500 p-1 rounded-full flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium">Sipariş takibi ve adres yönetimi</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Kayıt ediliyor...
                  </>
                ) : (
                  <>
                    Hesap Oluştur
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">
                    veya
                  </span>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600 font-medium">
                  Zaten hesabınız var mı?
                </p>
                <Link href="/login" className="block">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-11 border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 font-semibold transition-all duration-300 hover:shadow-md"
                  >
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Bottom decorative text */}
        <div className="text-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="font-medium">Premium Zeytinyağı ile Sağlıklı Yaşam</span>
            <Sparkles className="w-4 h-4 text-green-600" />
          </p>
        </div>
      </div>
    </div>
  );
}

