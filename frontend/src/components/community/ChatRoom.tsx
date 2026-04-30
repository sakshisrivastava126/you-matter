"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Wifi, WifiOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useSocket } from "@/hooks/useSocket";
import type { CommunityMessage } from "@/types";

interface ChatRoomProps {
  userId: string;
  userName: string;
  community?: string;
}

export const ChatRoom = ({
  userId,
  userName,
  community = "general",
}: ChatRoomProps) => {
  const { messages, sendMessage, isConnected } = useSocket(
    community,
    userId,
    userName
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Room header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/3 flex-shrink-0">
        <div>
          <h2 className="text-white font-semibold capitalize">
            # {community}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Community support room
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
            isConnected
              ? "text-emerald-400 bg-emerald-400/10"
              : "text-slate-500 bg-white/5"
          }`}
        >
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
          {isConnected ? "Live" : "Connecting…"}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-slate-400 text-sm">
              Be the first to say something in{" "}
              <span className="text-violet-400">#{community}</span>
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              msg={msg}
              isMine={msg.sender === userId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-violet-500/50 transition-colors">
          <Avatar name={userName} size="sm" />
          <input
            id="community-message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${community}…`}
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
          />
          <Button
            id="community-send-btn"
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="!px-3 !py-2 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            Connecting to server…
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
interface MessageBubbleProps {
  msg: CommunityMessage;
  isMine: boolean;
}

const MessageBubble = ({ msg, isMine }: MessageBubbleProps) => {
  const timeStr = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}>
      <Avatar name={msg.senderName || msg.sender} size="sm" className="flex-shrink-0 mt-1" />
      <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isMine && (
          <span className="text-xs text-slate-400 font-medium px-1">
            {msg.senderName || "User"}
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isMine
              ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
              : "bg-white/10 text-slate-200 rounded-tl-sm"
          }`}
        >
          {msg.content}
        </div>
        {timeStr && (
          <span className="text-xs text-slate-600 px-1">{timeStr}</span>
        )}
      </div>
    </div>
  );
};
