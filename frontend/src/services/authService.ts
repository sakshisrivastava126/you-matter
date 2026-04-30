import api from "./api";
import type { AuthResponse, SignupData, SpecialistsResponse } from "@/types";

/** Login with email + password. Returns the user object and token. */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
};

/** Register a new user account. */
export const signupUser = async (
  payload: SignupData
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/signup", payload);
  return data;
};

/** Clear the server-side JWT cookie. */
export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

/** Fetch all users with role 'specialist'. */
export const fetchSpecialists = async (): Promise<SpecialistsResponse> => {
  const { data } = await api.get<SpecialistsResponse>("/auth/specialists");
  return data;
};
