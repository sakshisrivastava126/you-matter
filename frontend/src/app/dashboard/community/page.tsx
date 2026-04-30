"use client";

import React, { useState } from "react";
import { Users, Hash, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ChatRoom } from "@/components/community/ChatRoom";
import { DirectMessagePane } from "@/components/community/DirectMessagePane";
import { useAuthContext } from "@/context/AuthContext";

const ROOMS = [
  { id: "general",     label: "General",     emoji: "💬", desc: "Open conversations for everyone" },
  { id: "anxiety",     label: "Anxiety",     emoji: "🌊", desc: "Support for anxiety & worry" },
  { id: "mindfulness", label: "Mindfulness", emoji: "🧘", desc: "Meditation & grounding" },
  { id: "recovery",    label: "Recovery",    emoji: "🌱", desc: "Healing & growth journeys" },
];

type Tab = "rooms" | "dms";

export default function CommunityPage() {
  const { user } = useAuthContext();
  const [activeRoom, setActiveRoom] = useState("general");
  const [activeTab, setActiveTab] = useState<Tab>("rooms");

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-violet-400" />
          Community
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Join a room and connect in real-time, or send private messages
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
        <button
          id="tab-rooms"
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === "rooms"
              ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Hash className="w-4 h-4" />
          Rooms
        </button>
        <button
          id="tab-dms"
          onClick={() => setActiveTab("dms")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === "dms"
              ? "bg-violet-600/30 text-violet-300 border border-violet-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Messages
        </button>
      </div>

      {/* ── Rooms tab ──────────────────────────────────────────────────────── */}
      {activeTab === "rooms" && (
        <div className="flex gap-5 h-[calc(100vh-16rem)]">
          {/* Sidebar */}
          <Card className="w-52 flex-shrink-0 flex flex-col p-3 gap-1 h-full overflow-y-auto">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-2 py-2">
              Rooms
            </p>
            {ROOMS.map((room) => (
              <button
                key={room.id}
                id={`room-${room.id}`}
                onClick={() => setActiveRoom(room.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left w-full transition-all duration-200 ${
                  activeRoom === room.id
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/8"
                }`}
              >
                <span className="text-base">{room.emoji}</span>
                <div className="min-w-0">
                  <p className="truncate">{room.label}</p>
                </div>
                {activeRoom === room.id && (
                  <Hash className="w-3 h-3 ml-auto text-violet-400 flex-shrink-0" />
                )}
              </button>
            ))}

            <div className="mt-auto pt-3 border-t border-white/10">
              <p className="text-slate-600 text-xs px-2 leading-relaxed">
                🔒 All conversations are anonymous and supportive.
              </p>
            </div>
          </Card>

          {/* Chat area */}
          <Card className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
            <ChatRoom
              userId={user._id}
              userName={user.userName}
              community={activeRoom}
            />
          </Card>
        </div>
      )}

      {/* ── DMs tab ────────────────────────────────────────────────────────── */}
      {activeTab === "dms" && (
        <DirectMessagePane currentUser={user} />
      )}
    </div>
  );
}
