"use client";

import React from "react";
import { Bot, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { useAuthContext } from "@/context/AuthContext";

export default function ChatbotPage() {
  const { user } = useAuthContext();
  if (!user) return null;

  return (
    <div className="space-y-5 h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-400" />
            AI Support
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Talk to your AI psychiatric companion — available 24/7
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          Private & confidential
        </div>
      </div>

      {/* Chat window */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatBot userName={user.userName} />
      </Card>
    </div>
  );
}
