"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth";
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
import { Mail, Lock, LogIn, Sparkles, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Success case handled by server action redirect
    } catch (err) {
      setError("Bir hata oluştu");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-olive-gradient-soft px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 md:w-72 md:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-52 h-52 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      
      {/* Floating olive icons */}
      <div className="absolute top-20 left-[15%] text-4xl md:text-6xl animate-float hidden md:block opacity-20">
        🫒
      </div>
      <div className="absolute bottom-32 right-[10%] text-5xl md:text-7xl animate-float hidden md:block opacity-20" style={{ animationDelay: '2s' }}>
        🫒
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Welcome Badge */}
        <div className="text-center mb-6 animate-fadeInUp">
          <Badge className="bg-white/90 text-primary border-primary/20 shadow-lg px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Hoş Geldiniz
          </Badge>
        </div>

        <Card className="border-2 border-white/50 shadow-2xl backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-500 animate-fadeInUp">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-olive-gradient w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <LogIn className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Giriş Yap
            </CardTitle>
            <CardDescription className="text-center text-base">
              Hesabınıza erişmek için bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3 animate-fadeInUp shadow-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
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
                    className={`pl-11 h-12 border-2 transition-all duration-300 ${
                      focusedField === 'email' 
                        ? 'border-primary shadow-lg ring-4 ring-primary/10' 
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  />
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-11 h-12 border-2 transition-all duration-300 ${
                      focusedField === 'password' 
                        ? 'border-primary shadow-lg ring-4 ring-primary/10' 
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  />
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                    focusedField === 'password' ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-olive-gradient hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    Giriş Yap
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">
                    veya
                  </span>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Henüz hesabınız yok mu?
                </p>
                <Link href="/register" className="block">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-11 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-semibold transition-all duration-300 hover:shadow-md"
                  >
                    Yeni Hesap Oluştur
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Bottom decorative text */}
        <div className="text-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Premium Zeytinyağı ile Sağlıklı Yaşam
            <Sparkles className="w-4 h-4 text-primary" />
          </p>
        </div>
      </div>
    </div>
  );
}

