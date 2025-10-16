import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAddresses } from "@/actions/addresses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddressCard } from "@/components/profile/address-card";
import { AddAddressDialog } from "@/components/profile/add-address-dialog";
import { MapPin } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const addresses = await getUserAddresses();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Adreslerim</h1>
          <AddAddressDialog />
        </div>

        {addresses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Henüz kayıtlı adresiniz yok.</p>
              <AddAddressDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

