import api from "./api";
import type { BotResponse } from "@/types";

/**
 * Send a message to the AI psychiatrist chatbot.
 * @param prompt - The user's message
 */
export const sendBotMessage = async (prompt: string): Promise<BotResponse> => {
  const { data } = await api.post<BotResponse>("/bot/chat", { prompt });
  return data;
};
