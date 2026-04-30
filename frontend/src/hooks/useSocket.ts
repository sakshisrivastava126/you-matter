"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { CommunityMessage } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444";

/**
 * Hook that manages a Socket.IO connection for a community room.
 * @param community - The room name to join (e.g. "general")
 * @param userId - Current user's _id (used as sender)
 * @param userName - Current user's display name
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
      transports: ["polling", "websocket"], // start with polling, upgrade to WS
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join-community", community);
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("community-message", (msg: CommunityMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave-community", community);
      socket.disconnect();
    };
  }, [community, userId]);

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
      socketRef.current.emit("community-message", msg);
      // Optimistically add own message
      setMessages((prev) => [...prev, msg]);
    },
    [community, userId, userName]
  );

  return { messages, sendMessage, isConnected };
};
