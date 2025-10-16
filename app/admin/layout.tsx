import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-8">
            <h1 className="text-xl font-bold">Admin Paneli</h1>
            <nav className="flex gap-4">
              <Link href="/admin">
                <Button variant="ghost">Genel Bakış</Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="ghost">Ürünler</Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="ghost">Siparişler</Button>
              </Link>
              <Link href="/admin/coupons">
                <Button variant="ghost">Kuponlar</Button>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

