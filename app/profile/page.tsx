import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateNameForm } from "@/components/profile/update-name-form";
import { UpdatePasswordForm } from "@/components/profile/update-password-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profilim</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Update Name */}
          <Card>
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateNameForm currentName={session.user.name || ""} />
            </CardContent>
          </Card>

          {/* Update Password */}
          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdatePasswordForm />
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">E-posta:</span>
                <span className="font-medium">{session.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hesap Tipi:</span>
                <span className="font-medium">
                  {session.user.role === "ADMIN" ? "Yönetici" : "Müşteri"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

