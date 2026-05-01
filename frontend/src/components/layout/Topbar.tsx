"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Heart, LayoutDashboard, Users, Stethoscope, Bot, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthContext } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/community", label: "Community", icon: Users },
  { href: "/dashboard/specialists", label: "Specialists", icon: Stethoscope },
  { href: "/dashboard/chatbot", label: "AI Support", icon: Bot },
];

export const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const pageTitle = navItems.find((n) =>
    n.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.href)
  )?.label ?? "Dashboard";

  return (
    <>
      {/* Top bar — mobile only */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-[#E8EDF2] shadow-[0_1px_8px_rgba(74,111,165,.08)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#CFE8F3] to-[#E6DDF5] flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#4A6FA5] fill-[#4A6FA5]" />
          </div>
          <span className="text-[#333333] font-semibold text-sm">{pageTitle}</span>
        </div>
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 rounded-lg text-[#5A6475] hover:text-[#4A6FA5] hover:bg-[#CFE8F3]/50 transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#333333]/20 backdrop-blur-sm" />

          {/* Drawer panel */}
          <nav
            className="relative w-72 max-w-[85vw] h-full bg-white border-r border-[#E8EDF2] flex flex-col p-4 gap-1 overflow-y-auto shadow-[4px_0_24px_rgba(74,111,165,.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 pb-4 border-b border-[#E8EDF2] mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#CFE8F3] to-[#E6DDF5] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#4A6FA5] fill-[#4A6FA5]" />
              </div>
              <div>
                <p className="text-[#333333] font-bold leading-none">You Matter</p>
                <p className="text-[#B8C0CC] text-xs">Mental Health Platform</p>
              </div>
            </div>

            {/* Nav links */}
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#CFE8F3] text-[#4A6FA5]"
                      : "text-[#5A6475] hover:text-[#4A6FA5] hover:bg-[#CFE8F3]/50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-[#4A6FA5]" : "text-[#B8C0CC]"}`}
                  />
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4A6FA5]" />
                  )}
                </Link>
              );
            })}

            {/* Footer */}
            <div className="mt-auto border-t border-[#E8EDF2] pt-4 space-y-1">
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E8EDF2]">
                  <Avatar name={user.userName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[#333333] text-sm font-medium truncate">{user.userName}</p>
                    <p className="text-[#B8C0CC] text-xs capitalize">{user.role}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#5A6475] hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
