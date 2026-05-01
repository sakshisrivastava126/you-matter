"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Send, MessageCircle, Search, Wifi, WifiOff, ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDmSocket } from "@/hooks/useDmSocket";
import { fetchUsers, fetchDmHistory, persistDm } from "@/services/dmService";
import type { User, DirectMessage } from "@/types";

interface DirectMessagePaneProps {
  currentUser: User;
}

type ConvoMap = Record<string, DirectMessage[]>;

const addToConvo = (map: ConvoMap, key: string, msg: DirectMessage): ConvoMap => {
  const existing = map[key] ?? [];
  if (msg._id && existing.some((m) => m._id === msg._id)) return map;
  return { ...map, [key]: [...existing, msg] };
};

export const DirectMessagePane = ({ currentUser }: DirectMessagePaneProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [convos, setConvos] = useState<ConvoMap>({});
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedUserRef = useRef<User | null>(null);
  selectedUserRef.current = selectedUser;

  useEffect(() => {
    fetchUsers()
      .then((res) => { if (res.success) setUsers(res.users); })
      .catch(console.error);
  }, []);

  const handleIncoming = useCallback((msg: DirectMessage) => {
    const otherUserId =
      msg.senderId === currentUser._id ? msg.receiverId : msg.senderId;
    setConvos((prev) => addToConvo(prev, otherUserId, msg));
    if (
      msg.senderId !== currentUser._id &&
      msg.senderId !== selectedUserRef.current?._id
    ) {
      setUnread((prev) => ({ ...prev, [msg.senderId]: (prev[msg.senderId] ?? 0) + 1 }));
    }
  }, [currentUser._id]);

  const { sendDm } = useDmSocket({
    userId: currentUser._id,
    onMessage: handleIncoming,
    onOnlineUsers: (ids) => { setOnlineUserIds(ids); setIsConnected(true); },
  });

  useEffect(() => {
    if (!selectedUser) return;
    setUnread((prev) => ({ ...prev, [selectedUser._id]: 0 }));
    if (convos[selectedUser._id]) return;
    fetchDmHistory(selectedUser._id)
      .then((res) => {
        if (res.success && res.messages) {
          setConvos((prev) => ({ ...prev, [selectedUser._id]: res.messages! }));
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const messages = selectedUser ? (convos[selectedUser._id] ?? []) : [];
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser || isSending) return;
    const text = input.trim();
    setInput("");
    setIsSending(selectedUser._id);
    try {
      const res = await persistDm(selectedUser._id, text);
      if (res.success && res.newMessage) {
        const msg = res.newMessage;
        setConvos((prev) => addToConvo(prev, selectedUser._id, msg));
        sendDm(selectedUser._id, msg);
      }
    } catch (err) {
      console.error("Failed to send DM:", err);
    } finally {
      setIsSending("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filteredUsers = users.filter((u) =>
    u.userName.toLowerCase().includes(search.toLowerCase())
  );

  // ── Shared: People List ────────────────────────────────────────────────────
  const PeopleList = () => (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#B8C0CC]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people…"
          className="w-full bg-[#FAFAFA] border border-[#E8EDF2] rounded-xl pl-8 pr-3 py-2 text-xs text-[#333333] placeholder:text-[#B8C0CC] focus:outline-none focus:border-[#4A6FA5]/40 focus:shadow-[0_0_0_3px_rgba(74,111,165,.08)] transition-all"
        />
      </div>

      <p className="text-[#B8C0CC] text-xs font-semibold uppercase tracking-widest px-1 pt-1">
        People
      </p>

      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
        {filteredUsers.length === 0 ? (
          <p className="text-[#B8C0CC] text-xs text-center py-6">No users found</p>
        ) : (
          filteredUsers.map((u) => {
            const isOnline = onlineUserIds.includes(u._id);
            const isSelected = selectedUser?._id === u._id;
            const badge = unread[u._id] ?? 0;
            return (
              <button
                key={u._id}
                id={`dm-user-${u._id}`}
                onClick={() => setSelectedUser(u)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 border ${
                  isSelected
                    ? "bg-[#CFE8F3] border-[#B8D8EC]"
                    : "hover:bg-[#CFE8F3]/30 border-transparent hover:border-[#D8EEF8]"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar name={u.userName} size="sm" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? "bg-emerald-400" : "bg-[#B8C0CC]"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${isSelected ? "text-[#4A6FA5]" : "text-[#333333]"}`}>{u.userName}</p>
                  <p className="text-xs text-[#B8C0CC] truncate capitalize">{u.role}</p>
                </div>
                {badge > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4A6FA5] text-white text-[10px] font-bold flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </>
  );

  // ── Shared: Chat Messages ──────────────────────────────────────────────────
  const ChatPane = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8EDF2] bg-gradient-to-r from-[#CFE8F3]/20 to-[#E6DDF5]/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button — mobile only */}
          <button
            onClick={() => setSelectedUser(null)}
            className="lg:hidden p-1.5 -ml-1 rounded-lg text-[#5A6475] hover:text-[#4A6FA5] hover:bg-[#CFE8F3]/50 transition-colors"
            aria-label="Back to contacts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <Avatar name={selectedUser!.userName} size="md" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${onlineUserIds.includes(selectedUser!._id) ? "bg-emerald-400" : "bg-[#B8C0CC]"}`} />
          </div>
          <div>
            <h2 className="text-[#333333] font-semibold text-sm leading-tight">{selectedUser!.userName}</h2>
            <p className="text-xs text-[#B8C0CC] capitalize">
              {onlineUserIds.includes(selectedUser!._id) ? "Online" : "Offline"} · {selectedUser!.role}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border ${isConnected ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-[#B8C0CC] bg-[#FAFAFA] border-[#E8EDF2]"}`}>
          {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isConnected ? "Live" : "Connecting…"}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-4 min-h-0 bg-[#FAFAFA]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E6DDF5] border border-[#D8CFF0] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#6B52A5]" />
            </div>
            <p className="text-[#B8C0CC] text-sm">
              Start a conversation with <span className="text-[#4A6FA5] font-medium">{selectedUser!.userName}</span>
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === currentUser._id;
            const senderName = isMine ? currentUser.userName : selectedUser!.userName;
            const timeStr = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";
            return (
              <div key={msg._id ?? i} className={`flex gap-2.5 ${isMine ? "flex-row-reverse" : ""}`}>
                <Avatar name={senderName} size="sm" className="flex-shrink-0 mt-1" />
                <div className={`max-w-[80%] sm:max-w-[70%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                  {!isMine && <span className="text-xs text-[#B8C0CC] font-medium px-1">{senderName}</span>}
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMine ? "bg-[#4A6FA5] text-white rounded-tr-sm" : "bg-white text-[#333333] rounded-tl-sm border border-[#E8EDF2]"}`}>
                    {msg.message}
                  </div>
                  {timeStr && <span className="text-xs text-[#B8C0CC] px-1">{timeStr}</span>}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-3 sm:px-5 py-3 border-t border-[#E8EDF2] bg-white">
        <div className="flex items-center gap-2 sm:gap-3 bg-[#FAFAFA] border border-[#E8EDF2] rounded-2xl px-3 sm:px-4 py-2 focus-within:border-[#4A6FA5]/40 focus-within:shadow-[0_0_0_3px_rgba(74,111,165,.08)] transition-all">
          <Avatar name={currentUser.userName} size="sm" />
          <input
            id="dm-message-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedUser!.userName}…`}
            className="flex-1 bg-transparent text-[#333333] placeholder:text-[#B8C0CC] text-sm focus:outline-none"
          />
          <Button
            id="dm-send-btn"
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || !!isSending}
            isLoading={!!isSending}
            className="!px-2.5 sm:!px-3 !py-2 rounded-xl flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  // ── MOBILE layout: single-column, slides between list & chat ──────────────
  const mobileCardClass = "flex-1 flex flex-col min-h-0 overflow-hidden";

  return (
    <>
      {/* ── MOBILE (<lg) ───────────────────────────────────────────────── */}
      <div className="lg:hidden flex-1 flex flex-col min-h-0">
        {!selectedUser ? (
          <Card className={`${mobileCardClass} gap-3 p-3`}>
            <PeopleList />
            {filteredUsers.length > 0 && (
              <p className="text-xs text-[#B8C0CC] text-center pb-1 flex-shrink-0">
                Tap a person to start chatting
              </p>
            )}
          </Card>
        ) : (
          <Card className={mobileCardClass}>
            <ChatPane />
          </Card>
        )}
      </div>

      {/* ── DESKTOP (lg+) — side-by-side ─────────────────────────────── */}
      <div className="hidden lg:flex flex-1 min-h-0 gap-5">
        <Card className="w-64 flex-shrink-0 flex flex-col p-3 gap-2 overflow-hidden">
          <PeopleList />
        </Card>
        <Card className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {selectedUser ? (
            <ChatPane />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#CFE8F3] to-[#E6DDF5] border border-[#D1DAE5] flex items-center justify-center">
                <MessageCircle className="w-9 h-9 text-[#4A6FA5]" />
              </div>
              <div>
                <h3 className="text-[#333333] font-semibold text-lg">Direct Messages</h3>
                <p className="text-[#B8C0CC] text-sm mt-1">Select someone from the list to start a private conversation</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};
