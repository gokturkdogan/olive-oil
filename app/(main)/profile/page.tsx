import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
            Profilim
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Hesap bilgilerinizi yönetin ve güncelleyin
          </p>
          
          {/* User Welcome */}
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
            <Badge className="bg-white/90 text-primary border-primary/20 shadow-lg px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Hoş geldin, {session.user.name}
            </Badge>
            {session.user.role === "ADMIN" && (
              <Badge className="bg-olive-gradient text-white shadow-lg px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2 inline" />
                Yönetici
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Update Name */}
            <Card className="border-2 border-primary/15 shadow-md hover:border-primary/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2.5 rounded-xl">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">Kişisel Bilgiler</CardTitle>
                </div>
                <CardDescription>
                  Ad ve soyad bilgilerinizi güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpdateNameForm currentName={session.user.name || ""} />
              </CardContent>
            </Card>

            {/* Update Password */}
            <Card className="border-2 border-primary/15 shadow-md hover:border-primary/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2.5 rounded-xl">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">Şifre Değiştir</CardTitle>
                </div>
                <CardDescription>
                  Hesap güvenliğiniz için şifrenizi güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpdatePasswordForm />
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="md:col-span-2 border-2 border-primary/15 shadow-md hover:border-primary/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2.5 rounded-xl">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">Hesap Bilgileri</CardTitle>
                </div>
                <CardDescription>
                  Hesabınıza ait sabit bilgiler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-olive-gradient-soft rounded-xl p-4 border border-primary/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">E-posta Adresi</span>
                    </div>
                    <p className="text-base md:text-lg font-semibold text-gray-900 ml-11 break-all">
                      {session.user.email}
                    </p>
                  </div>
                  
                  <div className="bg-olive-gradient-soft rounded-xl p-4 border border-primary/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">Hesap Türü</span>
                    </div>
                    <div className="ml-11">
                      <Badge className={session.user.role === "ADMIN" ? "bg-olive-gradient text-white" : "bg-primary/10 text-primary"}>
                        {session.user.role === "ADMIN" ? "Yönetici" : "Müşteri"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

