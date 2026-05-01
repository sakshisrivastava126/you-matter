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
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-[#E8EDF2] z-30 shadow-[1px_0_12px_rgba(74,111,165,.06)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E8EDF2]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#CFE8F3] to-[#E6DDF5] flex items-center justify-center shadow-sm">
          <Heart className="w-5 h-5 text-[#4A6FA5] fill-[#4A6FA5]" />
        </div>
        <div>
          <p className="text-[#333333] font-bold text-lg leading-none">You Matter</p>
          <p className="text-[#B8C0CC] text-xs mt-0.5">Mental Health Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
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
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  isActive
                    ? "bg-[#CFE8F3] text-[#4A6FA5] shadow-sm"
                    : "text-[#5A6475] hover:text-[#4A6FA5] hover:bg-[#CFE8F3]/50"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? "text-[#4A6FA5]" : "text-[#B8C0CC] group-hover:text-[#4A6FA5]"
                }`}
              />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4A6FA5]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 space-y-1 border-t border-[#E8EDF2] pt-4">
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E8EDF2]">
            <Avatar name={user.userName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[#333333] text-sm font-medium truncate">{user.userName}</p>
              <p className="text-[#B8C0CC] text-xs truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#5A6475] hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
