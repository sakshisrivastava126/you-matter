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
          <h1 className="text-2xl font-bold text-[#333333] flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#4A6FA5]" />
            AI Support
          </h1>
          <p className="text-[#B8C0CC] text-sm mt-1">
            Talk to your AI psychiatric companion — available 24/7
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          Private &amp; confidential
        </div>
      </div>

      {/* Chat window */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatBot userName={user.userName} />
      </Card>
    </div>
  );
}
