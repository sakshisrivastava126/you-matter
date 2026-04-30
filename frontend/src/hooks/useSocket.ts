"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { CommunityMessage } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444";

/**
 * Hook that manages a Socket.IO connection for a community room.
 *
 * WHY forceNew:true?
 * React 18 StrictMode runs every effect twice (mount → cleanup → mount) in
 * development. Without forceNew, socket.io-client reuses the same internal
 * Manager/socket for the same URL, so the second mount reconnects the
 * *already-disconnected* socket1 instead of creating socket2. The old event
 * listeners from mount #1 are still attached, causing duplicate handlers and
 * broken room membership on the server.
 *
 * @param community - The room name to join (e.g. "general")
 * @param userId    - Current user's _id (used as sender)
 * @param userName  - Current user's display name
 */
export const useSocket = (
  community: string,
  userId: string,
  userName: string
) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      forceNew: true,                          // Always a brand-new connection
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    // Named handlers so we can remove them precisely in cleanup
    const onConnect = () => {
      console.log(`[socket] connected as ${socket.id}, joining room "${community}"`);
      setIsConnected(true);
      socket.emit("join-community", community);
    };

    const onDisconnect = (reason: string) => {
      console.log(`[socket] disconnected: ${reason}`);
      setIsConnected(false);
    };

    const onCommunityMessage = (msg: CommunityMessage) => {
      console.log(`[socket] received community-message in "${community}":`, msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("community-message", onCommunityMessage);

    return () => {
      // Remove named listeners BEFORE disconnect so StrictMode's cleanup
      // never leaves stale handlers on a reused socket instance.
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("community-message", onCommunityMessage);
      socket.emit("leave-community", community);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [community, userId]);

  // Clear chat history when the user switches rooms
  useEffect(() => {
    setMessages([]);
  }, [community]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !text.trim()) return;
      const msg: CommunityMessage = {
        sender: userId,
        senderName: userName,
        content: text,
        community,
        timestamp: new Date().toISOString(),
      };
      console.log(`[socket] emitting to room "${community}":`, msg.content);
      // Server broadcasts to io.to(room) which includes the sender,
      // so we do NOT add locally — we wait for the server echo.
      socketRef.current.emit("community-message", msg);
    },
    [community, userId, userName]
  );

  return { messages, sendMessage, isConnected };
};
