import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpdateNameForm } from "@/components/profile/update-name-form";
import { UpdatePasswordForm } from "@/components/profile/update-password-form";
import { User, Lock, Mail, Shield, Sparkles, Trophy, TrendingUp, Star, Award, Gem, Crown, Truck, Check } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* User Header - Compact */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-30"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {session.user.name}
              </h1>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>
            {session.user.role === "ADMIN" ? (
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Yönetici
              </Badge>
            ) : (
              <Badge className={`${LOYALTY_COLORS[loyaltyTier]} px-3 py-1.5 border-2 flex items-center gap-1.5 shadow-lg`}>
                {getTierIcon(loyaltyTier, "h-3.5 w-3.5")}
                {LOYALTY_LABELS[loyaltyTier]}
              </Badge>
            )}
          </div>
        </div>

        {/* Loyalty Info - Only for non-admin */}
        {session.user.role !== "ADMIN" && (
          <div className="mb-6">
            <Card className="border-2 border-gray-200 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">Sadakat Durumunuz</CardTitle>
                      <p className="text-xs text-white/80 mt-0.5">Şu ana kadar {formatPrice(totalSpent)} harcama yaptınız</p>
                    </div>
                  </div>
                  <Badge className={`${LOYALTY_COLORS[loyaltyTier]} px-3 py-1.5 border-2 flex items-center gap-1.5`}>
                    {getTierIcon(loyaltyTier, "h-3.5 w-3.5")}
                    {LOYALTY_LABELS[loyaltyTier]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-5">
                {/* Current Status */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-green-900">Aktif Avantajlar</p>
                    <Badge className="bg-green-700 text-white text-xs">
                      {LOYALTY_LABELS[loyaltyTier]}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-sm text-green-800">
                      <div className="bg-green-600 p-1.5 rounded-lg">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="font-semibold">%{LOYALTY_DISCOUNTS[loyaltyTier]} sepet indirimi</span>
                    </div>
                    {(loyaltyTier === "PLATINUM" || loyaltyTier === "DIAMOND") && (
                      <div className="flex items-center gap-2.5 text-sm text-green-800">
                        <div className="bg-green-600 p-1.5 rounded-lg">
                          <Truck className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span>Tüm siparişlerde ücretsiz kargo</span>
                      </div>
                    )}
                    {loyaltyTier === "GOLD" && (
                      <div className="flex items-center gap-2.5 text-sm text-green-800">
                        <div className="bg-green-600 p-1.5 rounded-lg">
                          <Truck className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span>1000 TL üzeri ücretsiz kargo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* All Tiers Overview */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-700 mb-3">Seviye Sistemi</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["STANDARD", "GOLD", "PLATINUM", "DIAMOND"] as const).map((tier) => {
                      const isCurrentTier = tier === loyaltyTier;
                      const tierGradients = {
                        STANDARD: "from-gray-400 to-gray-600",
                        GOLD: "from-amber-500 to-yellow-600",
                        PLATINUM: "from-slate-400 to-gray-600",
                        DIAMOND: "from-blue-500 to-cyan-600",
                      };
                      
                      return (
                        <div
                          key={tier}
                          className={`group relative rounded-xl p-3 text-center transition-all duration-300 ${
                            isCurrentTier
                              ? `bg-gradient-to-br ${tierGradients[tier]} shadow-lg scale-105`
                              : `bg-gradient-to-br ${tierGradients[tier]} opacity-50 hover:opacity-70 hover:scale-105`
                          }`}
                        >
                          {isCurrentTier && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                              <Check className="h-2.5 w-2.5 text-white" />
                            </div>
                          )}
                          <div className="flex justify-center mb-1.5">
                            {getTierIcon(tier, `h-6 w-6 text-white ${!isCurrentTier && 'opacity-70'}`)}
                          </div>
                          <p className={`text-xs font-bold mb-0.5 ${isCurrentTier ? 'text-white' : 'text-white/70'}`}>
                            {LOYALTY_LABELS[tier]}
                          </p>
                          <p className={`text-[10px] ${isCurrentTier ? 'text-white/90' : 'text-white/60'}`}>
                            %{LOYALTY_DISCOUNTS[tier]} indirim
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Tier Progress */}
                {nextTierInfo ? (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-500 p-1.5 rounded-lg">
                          <TrendingUp className="h-3.5 w-3.5 text-white" />
                        </div>
                        <p className="text-sm font-bold text-amber-900">
                          {LOYALTY_LABELS[nextTierInfo.nextTier]} Seviyesi
                        </p>
                      </div>
                      <p className="text-sm font-black text-amber-700">
                        {formatPrice(nextTierInfo.remaining)}
                      </p>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2.5 overflow-hidden mb-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${nextTierInfo.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-amber-800">
                      {Math.round(nextTierInfo.progress)}% tamamlandı • %{LOYALTY_DISCOUNTS[nextTierInfo.nextTier]} indirim kazanacaksınız
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg">
                    <p className="text-sm font-bold text-white text-center flex items-center justify-center gap-2">
                      {getTierIcon(loyaltyTier, "h-4 w-4")}
                      En Yüksek Seviyedesiniz!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Update Name */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-500"></div>
            <Card className="relative border-2 border-gray-200 hover:border-green-400 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-2.5">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base font-bold text-gray-900">Kişisel Bilgiler</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <UpdateNameForm currentName={session.user.name || ""} />
              </CardContent>
            </Card>
          </div>

          {/* Update Password */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-500"></div>
            <Card className="relative border-2 border-gray-200 hover:border-green-400 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-2.5">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base font-bold text-gray-900">Şifre Değiştir</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <UpdatePasswordForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

