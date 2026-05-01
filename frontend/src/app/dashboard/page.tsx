"use client";

import React from "react";
import {
  Calendar,
  Mail,
  Users,
  Shield,
  Bot,
  Stethoscope,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";

const quickLinks = [
  {
    href: "/dashboard/community",
    icon: Users,
    label: "Community",
    desc: "Join the support room",
    iconBg: "bg-[#CFE8F3]",
    iconColor: "text-[#4A6FA5]",
    hoverBorder: "hover:border-[#CFE8F3]",
    btnColor: "text-[#4A6FA5]",
  },
  {
    href: "/dashboard/specialists",
    icon: Stethoscope,
    label: "Specialists",
    desc: "Book a session",
    iconBg: "bg-[#E6DDF5]",
    iconColor: "text-[#6B52A5]",
    hoverBorder: "hover:border-[#E6DDF5]",
    btnColor: "text-[#6B52A5]",
  },
  {
    href: "/dashboard/chatbot",
    icon: Bot,
    label: "AI Support",
    desc: "Chat with companion",
    iconBg: "bg-[#CFE8F3]",
    iconColor: "text-[#3A6A8A]",
    hoverBorder: "hover:border-[#CFE8F3]",
    btnColor: "text-[#3A6A8A]",
  },
];

const wellnessTips = [
  "Take 5 deep breaths to ground yourself when feeling overwhelmed.",
  "A 10-minute walk can significantly reduce anxiety levels.",
  "Journaling for 3 minutes daily builds emotional clarity over time.",
  "Reaching out to one person today can break cycles of isolation.",
  "Hydration and sleep are the two most underrated mental health tools.",
];

export default function DashboardPage() {
  const { user } = useAuthContext();
  if (!user) return null;

  const tip = wellnessTips[new Date().getDay() % wellnessTips.length];
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <Avatar name={user.userName} size="xl" />
        <div>
          <p className="text-[#B8C0CC] text-sm mb-1">Good to see you 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]">{user.userName}</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs bg-[#E6DDF5] text-[#6B52A5] border border-[#D8CFF0] px-3 py-1 rounded-full capitalize font-medium">
              <Shield className="w-3 h-3" />
              {user.role}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-[#FAFAFA] text-[#B8C0CC] border border-[#E8EDF2] px-3 py-1 rounded-full">
              <Calendar className="w-3 h-3" />
              Joined {joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Profile info + daily tip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardBody>
            <h2 className="text-[#333333] font-semibold text-lg mb-5 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#4A6FA5]" />
              Your Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: Mail, label: "Email", value: user.email },
                { icon: Calendar, label: "Age", value: `${user.age} years` },
                { icon: Shield, label: "Role", value: user.role, capitalize: true },
                {
                  icon: TrendingUp,
                  label: "Community",
                  value: user.community ? "Active Member" : "Not Joined",
                },
              ].map(({ icon: Icon, label, value, capitalize }) => (
                <div key={label} className="flex items-start gap-3 bg-[#FAFAFA] border border-[#E8EDF2] rounded-xl p-3 sm:p-4">
                  <Icon className="w-4 h-4 text-[#B8C0CC] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[#B8C0CC] text-xs mb-0.5">{label}</p>
                    <p className={`text-[#333333] text-sm font-medium truncate ${capitalize ? "capitalize" : ""}`}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Daily tip */}
        <div className="rounded-2xl border border-[#D8CFF0] bg-gradient-to-br from-[#CFE8F3] to-[#E6DDF5] shadow-[0_2px_12px_rgba(74,111,165,.10)]">
          <div className="p-6 flex flex-col h-full gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
              <span className="text-xl">💡</span>
            </div>
            <h3 className="text-[#333333] font-semibold">Daily Wellness Tip</h3>
            <p className="text-[#5A6475] text-sm leading-relaxed flex-1">{tip}</p>
            <p className="text-[#4A6FA5] text-xs font-medium">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-[#333333] font-semibold text-lg mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(({ href, icon: Icon, label, desc, iconBg, iconColor, hoverBorder, btnColor }) => (
            <Link key={href} href={href}>
              <Card
                className={`hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(74,111,165,.13)] ${hoverBorder} transition-all duration-300 cursor-pointer group border-[#E8EDF2]`}
              >
                <CardBody className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-[#333333] font-semibold">{label}</h3>
                    <p className="text-[#B8C0CC] text-sm mt-0.5">{desc}</p>
                  </div>
                  <Button variant="ghost" size="sm" className={`w-fit !px-0 !border-0 ${btnColor} hover:!bg-transparent font-medium`}>
                    Open →
                  </Button>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
