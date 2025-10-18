import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="border-b bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="bg-olive-gradient p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Admin Paneli</h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Yönetim Sistemi</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <AdminNav />
              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
              <AdminUserMenu user={session.user} />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

