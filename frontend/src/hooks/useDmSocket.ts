"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { DirectMessage } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444";

interface UseDmSocketOptions {
  userId: string;
  onMessage: (msg: DirectMessage) => void;
  onOnlineUsers?: (userIds: string[]) => void;
}

/**
 * DM socket hook — one connection per component mount, with forceNew:true
 * to avoid StrictMode issues. Always adds a `connect` listener so the user
 * is re-registered after any reconnect.
 */
export const useDmSocket = ({ userId, onMessage, onOnlineUsers }: UseDmSocketOptions) => {
  const onMessageRef = useRef(onMessage);
  const onOnlineRef = useRef(onOnlineUsers);
  // Update refs every render so handlers are never stale
  onMessageRef.current = onMessage;
  onOnlineRef.current = onOnlineUsers;

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      forceNew: true,
      transports: ["polling", "websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    // Register on EVERY connect (initial + reconnects)
    const register = () => {
      console.log(`[dm-socket] registering userId=${userId}`);
      socket.emit("register-user", userId);
    };

    const onDm = (msg: DirectMessage) => {
      console.log("[dm-socket] received dm-message:", msg);
      onMessageRef.current(msg);
    };

    const onOnline = (ids: string[]) => {
      onOnlineRef.current?.(ids);
    };

    socket.on("connect", register);
    socket.on("dm-message", onDm);
    socket.on("online-users", onOnline);

    return () => {
      socket.off("connect", register);
      socket.off("dm-message", onDm);
      socket.off("online-users", onOnline);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const sendDm = useCallback(
    (toUserId: string, message: DirectMessage) => {
      const socket = socketRef.current;
      if (!socket) return;
      console.log(`[dm-socket] emitting dm-message to ${toUserId}:`, message.message);
      socket.emit("dm-message", { toUserId, message });
    },
    []
  );

  return { sendDm };
};
