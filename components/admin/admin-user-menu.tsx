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
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg">
        <User className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
      </div>

      {/* Logout */}
      <form action={handleLogout}>
        <Button
          variant="destructive"
          size="sm"
          type="submit"
          className="hover:bg-red-700 transition-colors"
          title="Çıkış Yap"
        >
          <LogOut className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Çıkış</span>
        </Button>
      </form>
    </div>
  );
}

