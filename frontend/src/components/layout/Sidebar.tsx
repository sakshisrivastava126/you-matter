"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Bot,
  LogOut,
  Heart,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/community", label: "Community", icon: Users },
  { href: "/dashboard/specialists", label: "Specialists", icon: Stethoscope },
  { href: "/dashboard/chatbot", label: "AI Support", icon: Bot },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-none">You Matter</p>
          <p className="text-slate-400 text-xs mt-0.5">Mental Health Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  isActive
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/8"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-4">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <Avatar name={user.userName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.userName}</p>
              <p className="text-slate-400 text-xs truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
