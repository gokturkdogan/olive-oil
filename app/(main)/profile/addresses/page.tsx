import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAddresses } from "@/actions/addresses";
import { Card, CardContent } from "@/components/ui/card";
import { AddressCard } from "@/components/profile/address-card";
import { AddAddressDialog } from "@/components/profile/add-address-dialog";
import { MapPin, Plus, Sparkles } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const addresses = await getUserAddresses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-12 md:py-16 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-center sm:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">Adres Yönetimi</span>
                </div>
                
                {/* Icon */}
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-4 shadow-xl border border-white/30">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white leading-tight">
                  Adreslerim
                </h1>
                
                {/* Subtitle */}
                <p className="text-base sm:text-lg text-white/90 font-medium">
                  Teslimat adreslerinizi yönetin
                </p>
              </div>
              
              {/* Add Address Button */}
              <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <AddAddressDialog />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          {addresses.length === 0 ? (
            <Card className="border-2 border-green-200 shadow-2xl shadow-green-500/10 bg-white hover:shadow-3xl hover:border-green-300 transition-all duration-500 animate-fadeInUp">
              <CardContent className="py-16 md:py-20 text-center">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-24 h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <MapPin className="h-12 w-12 md:h-14 md:h-14 text-green-600" />
                </div>
                <h2 className="text-xl md:text-2xl text-gray-800 mb-3 font-bold">Henüz kayıtlı adresiniz yok</h2>
                <p className="text-base md:text-lg text-gray-600 mb-8 font-medium">
                  Hızlı teslimat için adres ekleyin
                </p>
                <AddAddressDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {addresses.map((address, index) => (
                <div 
                  key={address.id} 
                  className="animate-fadeInUp" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AddressCard address={address} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

