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
    color: "from-violet-500 to-indigo-600",
    glow: "shadow-violet-500/20",
  },
  {
    href: "/dashboard/specialists",
    icon: Stethoscope,
    label: "Specialists",
    desc: "Book a session",
    color: "from-teal-500 to-emerald-600",
    glow: "shadow-teal-500/20",
  },
  {
    href: "/dashboard/chatbot",
    icon: Bot,
    label: "AI Support",
    desc: "Chat with companion",
    color: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
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
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <Avatar name={user.userName} size="xl" />
        <div>
          <p className="text-slate-400 text-sm mb-1">Good to see you 👋</p>
          <h1 className="text-3xl font-bold text-white">{user.userName}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs bg-violet-500/15 text-violet-300 border border-violet-500/25 px-3 py-1 rounded-full capitalize font-medium">
              <Shield className="w-3 h-3" />
              {user.role}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/8 text-slate-400 px-3 py-1 rounded-full">
              <Calendar className="w-3 h-3" />
              Joined {joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Profile info card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardBody>
            <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <Heart className="w-5 h-5 text-violet-400" />
              Your Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs mb-1">Email</p>
                  <p className="text-white text-sm font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-1">Age</p>
                  <p className="text-white text-sm font-medium">{user.age} years</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-1">Role</p>
                  <p className="text-white text-sm font-medium capitalize">{user.role}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <TrendingUp className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs mb-1">Community</p>
                  <p className="text-white text-sm font-medium">
                    {user.community ? "Active Member" : "Not Joined"}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Daily tip */}
        <Card className="bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border-violet-500/20">
          <CardBody className="flex flex-col h-full gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <span className="text-xl">💡</span>
            </div>
            <h3 className="text-white font-semibold">Daily Wellness Tip</h3>
            <p className="text-slate-300 text-sm leading-relaxed flex-1">{tip}</p>
            <p className="text-violet-400 text-xs font-medium">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(({ href, icon: Icon, label, desc, color, glow }) => (
            <Link key={href} href={href}>
              <Card className={`hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glow} cursor-pointer group`}>
                <CardBody className="flex flex-col gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{label}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">{desc}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-fit !px-0 text-violet-400 hover:text-violet-300">
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
