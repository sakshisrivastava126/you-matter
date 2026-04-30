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
      {/* Top bar (mobile) */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-slate-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-semibold">{pageTitle}</span>
        </div>
        <button
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <nav
            className="relative w-72 h-full bg-slate-900 border-r border-white/10 flex flex-col p-4 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 pb-4 border-b border-white/10 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-white font-bold">You Matter</span>
            </div>

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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}

            <div className="mt-auto border-t border-white/10 pt-4 space-y-1">
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                  <Avatar name={user.userName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user.userName}</p>
                    <p className="text-slate-400 text-xs capitalize">{user.role}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
