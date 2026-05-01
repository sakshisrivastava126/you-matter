"use client";

import React, { useState } from "react";
import { Users, Hash, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ChatRoom } from "@/components/community/ChatRoom";
import { DirectMessagePane } from "@/components/community/DirectMessagePane";
import { useAuthContext } from "@/context/AuthContext";

const ROOMS = [
  { id: "general",     label: "General",     emoji: "💬" },
  { id: "anxiety",     label: "Anxiety",     emoji: "🌊" },
  { id: "mindfulness", label: "Mindfulness", emoji: "🧘" },
  { id: "recovery",    label: "Recovery",    emoji: "🌱" },
];

type Tab = "rooms" | "dms";

export default function CommunityPage() {
  const { user } = useAuthContext();
  const [activeRoom, setActiveRoom] = useState("general");
  const [activeTab, setActiveTab] = useState<Tab>("rooms");

  if (!user) return null;

  return (
    /* flex-1 + flex-col so this page fills the parent flex container */
    <div className="flex-1 flex flex-col min-h-0 gap-4">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-[#333333] flex items-center gap-2">
          <Users className="w-6 h-6 text-[#4A6FA5]" />
          Community
        </h1>
        <p className="text-[#B8C0CC] text-sm mt-1">
          Join a room and connect in real-time, or send private messages
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex-shrink-0 flex items-center gap-1 bg-[#F0F6FA] border border-[#E8EDF2] rounded-2xl p-1 w-fit shadow-sm">
        <button
          id="tab-rooms"
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === "rooms"
              ? "bg-[#CFE8F3] text-[#4A6FA5] shadow-sm"
              : "text-[#5A6475] hover:text-[#4A6FA5] hover:bg-[#CFE8F3]/40"
          }`}
        >
          <Hash className="w-4 h-4" />
          Rooms
        </button>
        <button
          id="tab-dms"
          onClick={() => setActiveTab("dms")}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === "dms"
              ? "bg-[#E6DDF5] text-[#6B52A5] shadow-sm"
              : "text-[#5A6475] hover:text-[#6B52A5] hover:bg-[#E6DDF5]/40"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Messages
        </button>
      </div>

      {/* ── Rooms tab ──────────────────────────────────────────────── */}
      {activeTab === "rooms" && (
        /* flex-1 so this section grows to fill remaining height */
        <div className="flex-1 flex flex-col min-h-0 gap-3">
          {/* Mobile: horizontal room pills */}
          <div className="lg:hidden flex-shrink-0 flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-none">
            {ROOMS.map((room) => (
              <button
                key={room.id}
                id={`room-pill-${room.id}`}
                onClick={() => setActiveRoom(room.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap snap-start flex-shrink-0 transition-all duration-200 border ${
                  activeRoom === room.id
                    ? "bg-[#CFE8F3] text-[#4A6FA5] border-[#B8D8EC]"
                    : "text-[#5A6475] bg-white border-[#E8EDF2] hover:text-[#4A6FA5] hover:bg-[#CFE8F3]/40"
                }`}
              >
                <span className="text-base leading-none">{room.emoji}</span>
                {room.label}
              </button>
            ))}
          </div>

          {/* Mobile: flex-1 chat fills rest */}
          <Card className="lg:hidden flex-1 flex flex-col min-h-0 overflow-hidden">
            <ChatRoom userId={user._id} userName={user.userName} community={activeRoom} />
          </Card>

          {/* Desktop: sidebar + chat side by side */}
          <div className="hidden lg:flex flex-1 min-h-0 gap-5">
            <Card className="w-52 flex-shrink-0 flex flex-col p-3 gap-1 overflow-y-auto">
              <p className="text-[#B8C0CC] text-xs font-semibold uppercase tracking-widest px-2 py-2">
                Rooms
              </p>
              {ROOMS.map((room) => (
                <button
                  key={room.id}
                  id={`room-${room.id}`}
                  onClick={() => setActiveRoom(room.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left w-full transition-all duration-200 ${
                    activeRoom === room.id
                      ? "bg-[#CFE8F3] text-[#4A6FA5]"
                      : "text-[#5A6475] hover:text-[#4A6FA5] hover:bg-[#CFE8F3]/40"
                  }`}
                >
                  <span className="text-base">{room.emoji}</span>
                  <p className="truncate">{room.label}</p>
                  {activeRoom === room.id && (
                    <Hash className="w-3 h-3 ml-auto text-[#4A6FA5] flex-shrink-0" />
                  )}
                </button>
              ))}
              <div className="mt-auto pt-3 border-t border-[#E8EDF2]">
                <p className="text-[#B8C0CC] text-xs px-2 leading-relaxed">
                  🔒 All conversations are anonymous and supportive.
                </p>
              </div>
            </Card>

            <Card className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <ChatRoom userId={user._id} userName={user.userName} community={activeRoom} />
            </Card>
          </div>
        </div>
      )}

      {/* ── DMs tab ────────────────────────────────────────────────── */}
      {activeTab === "dms" && (
        <div className="flex-1 flex flex-col min-h-0">
          <DirectMessagePane currentUser={user} />
        </div>
      )}
    </div>
  );
}
