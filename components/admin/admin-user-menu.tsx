"use client";

import { Button } from "@/components/ui/button";
import { handleLogout } from "@/actions/logout";
import { LogOut, User } from "lucide-react";

interface AdminUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminUserMenu({ user }: AdminUserMenuProps) {
  return (
    <div className="flex items-center gap-2">
      {/* User Info - Desktop */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-lg">
          <User className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-700">{user.name || user.email}</span>
      </div>


      {/* Logout */}
      <form action={handleLogout}>
        <Button
          variant="outline"
          size="sm"
          type="submit"
          className="border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 hover:text-red-800 transition-all duration-300 rounded-lg"
          title="Çıkış Yap"
        >
          <LogOut className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline font-semibold">Çıkış</span>
        </Button>
      </form>
    </div>
  );
}