import api from "./api";
import type { DmResponse, UsersResponse } from "@/types";

/** Fetch all users except the logged-in user */
export const fetchUsers = (): Promise<UsersResponse> =>
  api.get("/auth/users").then((r) => r.data);

/** Fetch DM history between the logged-in user and receiverId */
export const fetchDmHistory = (receiverId: string): Promise<DmResponse> =>
  api.get(`/message/dm/${receiverId}`).then((r) => r.data);

/** Persist a single DM to the database */
export const persistDm = (receiverId: string, text: string): Promise<DmResponse> =>
  api.post(`/message/dm/${receiverId}`, { text }).then((r) => r.data);
