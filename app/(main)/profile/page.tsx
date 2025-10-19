import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpdateNameForm } from "@/components/profile/update-name-form";
import { UpdatePasswordForm } from "@/components/profile/update-password-form";
import { User, Lock, Mail, Shield, Sparkles, Trophy, TrendingUp, Star, Award, Gem, Crown } from "lucide-react";
import { LOYALTY_LABELS, LOYALTY_COLORS, LOYALTY_DISCOUNTS, getNextTierInfo } from "@/lib/loyalty";
import { formatPrice } from "@/lib/money";

// Helper function to get tier icon component
function getTierIcon(tier: keyof typeof LOYALTY_LABELS, className?: string) {
  const iconProps = { className: className || "h-6 w-6" };
  switch (tier) {
    case "DIAMOND":
      return <Crown {...iconProps} />;
    case "PLATINUM":
      return <Gem {...iconProps} />;
    case "GOLD":
      return <Award {...iconProps} />;
    default:
      return <Star {...iconProps} />;
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user with raw query to avoid Prisma type issues
  const userData = await db.$queryRaw<Array<{
    loyalty_tier: string;
    total_spent: number;
  }>>`
    SELECT loyalty_tier, total_spent 
    FROM users 
    WHERE id = ${session.user.id}
    LIMIT 1
  `;

  const loyaltyTier = (userData[0]?.loyalty_tier || "STANDARD") as keyof typeof LOYALTY_LABELS;
  const totalSpent = userData[0]?.total_spent || 0;
  const nextTierInfo = getNextTierInfo(loyaltyTier, totalSpent);

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
            {session.user.role === "ADMIN" ? (
              <Badge className="bg-olive-gradient text-white shadow-lg px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2 inline" />
                Yönetici
              </Badge>
            ) : (
              <Badge className={`${LOYALTY_COLORS[loyaltyTier]} shadow-lg px-4 py-2 text-sm border-2 flex items-center gap-2`}>
                {getTierIcon(loyaltyTier, "h-4 w-4")}
                {LOYALTY_LABELS[loyaltyTier]} Üye
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Loyalty Program Card - Only for non-admin users */}
          {session.user.role !== "ADMIN" && (
            <Card className="mb-6 border-2 border-primary/20 shadow-xl bg-gradient-to-br from-white to-primary/5 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-olive-gradient p-3 rounded-xl shadow-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Sadakat Programı</CardTitle>
                      <CardDescription>Alışverişlerinizle seviye atlayın</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${LOYALTY_COLORS[loyaltyTier]} text-lg px-5 py-2 border-2 flex items-center gap-2`}>
                    {getTierIcon(loyaltyTier, "h-5 w-5")}
                    {LOYALTY_LABELS[loyaltyTier]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border-2 border-primary/10 hover:border-primary/30 transition-all">
                    <p className="text-sm text-gray-600 mb-1">Toplam Harcama</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(totalSpent)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-primary/10 hover:border-primary/30 transition-all">
                    <p className="text-sm text-gray-600 mb-1">Seviyeniz</p>
                    <p className="text-xl font-bold">{LOYALTY_LABELS[loyaltyTier]}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-primary/10 hover:border-primary/30 transition-all sm:col-span-1 col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Sepet İndirimi</p>
                    <p className="text-2xl font-bold text-green-600">%{LOYALTY_DISCOUNTS[loyaltyTier]}</p>
                  </div>
                </div>

                {/* Next Tier Progress */}
                {nextTierInfo ? (
                  <div className="bg-white rounded-lg p-5 border-2 border-primary/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          {LOYALTY_LABELS[nextTierInfo.nextTier]} Seviyesine
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          %{LOYALTY_DISCOUNTS[nextTierInfo.nextTier]} sepet indirimi kazanın
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(nextTierInfo.remaining)}
                        </p>
                        <p className="text-xs text-gray-500">kaldı</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className="bg-olive-gradient h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{
                          width: `${nextTierInfo.progress}%`,
                        }}
                      >
                        {nextTierInfo.progress > 15 && (
                          <span className="text-xs font-bold text-white">
                            {Math.round(nextTierInfo.progress)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-3 rounded-full shadow-md">
                        {getTierIcon(loyaltyTier, "h-8 w-8 text-blue-600")}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-900">
                          En Yüksek Seviyedesiniz!
                        </p>
                        <p className="text-sm text-blue-700">
                          %{LOYALTY_DISCOUNTS[loyaltyTier]} sepet indirimi ve tüm avantajlardan yararlanıyorsunuz
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tier Visual */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm font-medium text-gray-700 mb-3">Tüm Seviyeler</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(["STANDARD", "GOLD", "PLATINUM", "DIAMOND"] as const).map((tier) => (
                      <div
                        key={tier}
                        className={`text-center p-3 rounded-lg border-2 transition-all ${
                          tier === loyaltyTier
                            ? LOYALTY_COLORS[tier] + " shadow-md scale-105"
                            : "border-gray-200 opacity-40"
                        }`}
                      >
                        <div className="flex justify-center mb-1">
                          {getTierIcon(tier, "h-6 w-6")}
                        </div>
                        <p className="text-xs font-semibold">{LOYALTY_LABELS[tier]}</p>
                        <p className="text-xs text-gray-600 mt-0.5">%{LOYALTY_DISCOUNTS[tier]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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

