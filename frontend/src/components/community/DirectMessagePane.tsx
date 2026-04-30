"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Send, MessageCircle, Search, Wifi, WifiOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDmSocket } from "@/hooks/useDmSocket";
import { fetchUsers, fetchDmHistory, persistDm } from "@/services/dmService";
import type { User, DirectMessage } from "@/types";

interface DirectMessagePaneProps {
  currentUser: User;
}

// Keyed by the OTHER user's _id
type ConvoMap = Record<string, DirectMessage[]>;

const addToConvo = (map: ConvoMap, key: string, msg: DirectMessage): ConvoMap => {
  const existing = map[key] ?? [];
  // Deduplicate by _id
  if (msg._id && existing.some((m) => m._id === msg._id)) return map;
  return { ...map, [key]: [...existing, msg] };
};

export const DirectMessagePane = ({ currentUser }: DirectMessagePaneProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [convos, setConvos] = useState<ConvoMap>({});      // all conversations
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState("");          // userId being sent to
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedUserRef = useRef<User | null>(null);
  selectedUserRef.current = selectedUser;

  // ── Load user list ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchUsers()
      .then((res) => { if (res.success) setUsers(res.users); })
      .catch(console.error);
  }, []);

  // ── Handle incoming DM (store in conversation map regardless of selected) ─
  const handleIncoming = useCallback((msg: DirectMessage) => {
    // Which "other" user does this message belong to?
    const otherUserId =
      msg.senderId === currentUser._id ? msg.receiverId : msg.senderId;

    setConvos((prev) => addToConvo(prev, otherUserId, msg));

    // If the message is from someone other than the currently open conversation,
    // increment their unread badge
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

  // ── Load history when a user is selected ───────────────────────────────
  useEffect(() => {
    if (!selectedUser) return;
    // Clear unread for this user
    setUnread((prev) => ({ ...prev, [selectedUser._id]: 0 }));
    // Only fetch if we don't have any messages yet
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

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  const messages = selectedUser ? (convos[selectedUser._id] ?? []) : [];
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // ── Send ────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || !selectedUser || isSending) return;
    const text = input.trim();
    setInput("");
    setIsSending(selectedUser._id);
    try {
      const res = await persistDm(selectedUser._id, text);
      if (res.success && res.newMessage) {
        const msg = res.newMessage;
        // Add locally immediately
        setConvos((prev) => addToConvo(prev, selectedUser._id, msg));
        // Deliver real-time to recipient
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

  return (
    <div className="flex gap-5 h-[calc(100vh-16rem)]">

      {/* ── People sidebar ─────────────────────────────────────────── */}
      <Card className="w-64 flex-shrink-0 flex flex-col p-3 gap-2 h-full overflow-hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>

        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-1 pt-1">
          People
        </p>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredUsers.length === 0 ? (
            <p className="text-slate-600 text-xs text-center py-6">No users found</p>
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-violet-600/20 border border-violet-500/30"
                      : "hover:bg-white/8 border border-transparent"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar name={u.userName} size="sm" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${isOnline ? "bg-emerald-400" : "bg-slate-600"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isSelected ? "text-violet-300" : "text-slate-200"}`}>{u.userName}</p>
                    <p className="text-xs text-slate-500 truncate capitalize">{u.role}</p>
                  </div>
                  {badge > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* ── Chat pane ──────────────────────────────────────────────── */}
      <Card className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar name={selectedUser.userName} size="md" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${onlineUserIds.includes(selectedUser._id) ? "bg-emerald-400" : "bg-slate-600"}`} />
                </div>
                <div>
                  <h2 className="text-white font-semibold">{selectedUser.userName}</h2>
                  <p className="text-xs text-slate-400 capitalize">
                    {onlineUserIds.includes(selectedUser._id) ? "Online" : "Offline"} · {selectedUser.role}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${isConnected ? "text-emerald-400 bg-emerald-400/10" : "text-slate-500 bg-white/5"}`}>
                {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {isConnected ? "Live" : "Connecting…"}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-violet-400" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    Start a conversation with <span className="text-violet-400">{selectedUser.userName}</span>
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.senderId === currentUser._id;
                  const senderName = isMine ? currentUser.userName : selectedUser.userName;
                  const timeStr = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";
                  return (
                    <div key={msg._id ?? i} className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}>
                      <Avatar name={senderName} size="sm" className="flex-shrink-0 mt-1" />
                      <div className={`max-w-[70%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                        {!isMine && <span className="text-xs text-slate-400 font-medium px-1">{senderName}</span>}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm" : "bg-white/10 text-slate-200 rounded-tl-sm"}`}>
                          {msg.message}
                        </div>
                        {timeStr && <span className="text-xs text-slate-600 px-1">{timeStr}</span>}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-white/10">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-violet-500/50 transition-colors">
                <Avatar name={currentUser.userName} size="sm" />
                <input
                  id="dm-message-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selectedUser.userName}…`}
                  className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
                />
                <Button
                  id="dm-send-btn"
                  variant="primary"
                  size="sm"
                  onClick={handleSend}
                  disabled={!input.trim() || !!isSending}
                  isLoading={!!isSending}
                  className="!px-3 !py-2 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <MessageCircle className="w-9 h-9 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Direct Messages</h3>
              <p className="text-slate-400 text-sm mt-1">Select someone from the list to start a private conversation</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
