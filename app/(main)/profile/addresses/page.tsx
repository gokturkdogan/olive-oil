import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAddresses } from "@/actions/addresses";
import { Card, CardContent } from "@/components/ui/card";
import { AddressCard } from "@/components/profile/address-card";
import { AddAddressDialog } from "@/components/profile/add-address-dialog";
import { MapPin, Plus } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const addresses = await getUserAddresses();

  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-gradient-soft to-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-olive-gradient-soft py-12 md:py-16 lg:py-20 px-4 border-b border-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-52 h-52 md:w-80 md:h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <div className="bg-white/90 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-4 shadow-xl border-2 border-primary/20">
                  <MapPin className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 text-gray-900 leading-tight">
                  Adreslerim
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600">
                  Teslimat adreslerinizi yönetin
                </p>
              </div>
              <AddAddressDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          {addresses.length === 0 ? (
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardContent className="py-12 md:py-16 text-center">
                <div className="bg-primary/10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                </div>
                <p className="text-lg md:text-xl text-gray-700 mb-2 font-semibold">Henüz kayıtlı adresiniz yok</p>
                <p className="text-sm md:text-base text-gray-500 mb-6">
                  Hızlı teslimat için adres ekleyin
                </p>
                <AddAddressDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

