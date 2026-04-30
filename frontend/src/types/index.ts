// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface User {
  _id: string;
  userName: string;
  email: string;
  age: number;
  role: "user" | "specialist" | "consulte" | "User" | "Specialist" | "Consulte";
  community: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
}

export interface CommunityMessage {
  sender: string;
  senderName?: string;
  content: string;
  community: string;
  timestamp: string;
}

export interface BotMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface AuthResponse {
  succes?: boolean; // backend typo on login
  success?: boolean;
  user?: User;
  userData?: User;
  token?: string;
  message?: string;
}

export interface SpecialistsResponse {
  success: boolean;
  specialists: User[];
  message?: string;
}

export interface MessageResponse {
  success: boolean;
  messages?: Message[];
  newMessage?: Message;
  message?: string;
}

export interface BotResponse {
  success: boolean;
  message: string;
}

// ─── Auth Context ─────────────────────────────────────────────────────────────

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

export interface SignupData {
  userName: string;
  email: string;
  password: string;
  age: number;
  role: string;
}
