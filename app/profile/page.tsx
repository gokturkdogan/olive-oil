import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpdateNameForm } from "@/components/profile/update-name-form";
import { UpdatePasswordForm } from "@/components/profile/update-password-form";
import { User, Lock, Mail, Shield, Sparkles } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-gradient-soft to-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-olive-gradient-soft py-12 md:py-16 lg:py-20 px-4 border-b border-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-52 h-52 md:w-80 md:h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="bg-white/90 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl border-2 border-primary/20">
            <User className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gray-900 leading-tight">
            Hoş Geldin, <span className="text-gradient">{session.user.name}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Hesap bilgilerinizi buradan yönetebilirsiniz
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Update Name */}
            <Card className="border-2 border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 md:p-2.5 rounded-xl">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">Kişisel Bilgiler</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <UpdateNameForm currentName={session.user.name || ""} />
              </CardContent>
            </Card>

            {/* Update Password */}
            <Card className="border-2 border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 md:p-2.5 rounded-xl">
                    <Lock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">Şifre Değiştir</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <UpdatePasswordForm />
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="md:col-span-2 border-2 border-primary/20 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 md:p-2.5 rounded-xl">
                      <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg md:text-xl">Hesap Bilgileri</CardTitle>
                  </div>
                  {session.user.role === "ADMIN" && (
                    <Badge className="bg-primary text-white shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1 inline" />
                      Yönetici
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/10">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="text-sm md:text-base">E-posta:</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm md:text-base">{session.user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/10">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="text-sm md:text-base">Hesap Tipi:</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {session.user.role === "ADMIN" ? "Yönetici" : "Müşteri"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

