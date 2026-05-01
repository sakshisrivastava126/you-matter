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
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-[#E8EDF2] bg-gradient-to-r from-[#CFE8F3]/20 to-[#E6DDF5]/20 flex-shrink-0">
        <div>
          <h2 className="text-[#333333] font-semibold capitalize"># {community}</h2>
          <p className="text-[#B8C0CC] text-xs mt-0.5">Community support room</p>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border ${
            isConnected
              ? "text-emerald-600 bg-emerald-50 border-emerald-100"
              : "text-[#B8C0CC] bg-[#FAFAFA] border-[#E8EDF2]"
          }`}
        >
          {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isConnected ? "Live" : "Connecting…"}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4 min-h-0 bg-[#FAFAFA]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#CFE8F3] border border-[#B8D8EC] flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-[#B8C0CC] text-sm">
              Be the first to say something in{" "}
              <span className="text-[#4A6FA5] font-medium">#{community}</span>
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
      <div className="flex-shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-t border-[#E8EDF2] bg-white">
        <div className="flex items-center gap-2 sm:gap-3 bg-[#FAFAFA] border border-[#E8EDF2] rounded-2xl px-3 sm:px-4 py-2 focus-within:border-[#4A6FA5]/40 focus-within:shadow-[0_0_0_3px_rgba(74,111,165,.08)] transition-all">
          <Avatar name={userName} size="sm" />
          <input
            id="community-message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${community}…`}
            className="flex-1 bg-transparent text-[#333333] placeholder:text-[#B8C0CC] text-sm focus:outline-none"
          />
          <Button
            id="community-send-btn"
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="!px-2.5 sm:!px-3 !py-2 rounded-xl flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-[#B8C0CC] mt-2 text-center">Connecting to server…</p>
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
    <div className={`flex gap-2.5 sm:gap-3 ${isMine ? "flex-row-reverse" : ""}`}>
      <Avatar name={msg.senderName || msg.sender} size="sm" className="flex-shrink-0 mt-1" />
      <div className={`max-w-[80%] sm:max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isMine && (
          <span className="text-xs text-[#B8C0CC] font-medium px-1">
            {msg.senderName || "User"}
          </span>
        )}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isMine
              ? "bg-[#4A6FA5] text-white rounded-tr-sm shadow-sm"
              : "bg-white text-[#333333] rounded-tl-sm border border-[#E8EDF2] shadow-sm"
          }`}
        >
          {msg.content}
        </div>
        {timeStr && (
          <span className="text-xs text-[#B8C0CC] px-1">{timeStr}</span>
        )}
      </div>
    </div>
  );
};
