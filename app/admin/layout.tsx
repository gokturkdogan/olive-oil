import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { Shield, BarChart3 } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-green-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Admin Paneli</h1>
                <p className="text-xs text-gray-600 font-medium -mt-0.5 tracking-wider">YÖNETİM SİSTEMİ</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <AdminNav />
              <div className="h-8 w-px bg-green-200 hidden md:block"></div>
              <AdminUserMenu user={session.user} />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}