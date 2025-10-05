import { apiPost } from "./api";
import * as SecureStore from "expo-secure-store";

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: "Hombre" | "Mujer" | "Prefiero no decirlo" | "Otro";
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
    dateOfBirth?: string | null;
    gender?: string | null;
  };
};

export function register(payload: RegisterPayload) {
  return apiPost<{ message: string }>("/api/auth/register", payload);
}

export async function login(email: string, password: string) {
  const data = await apiPost<LoginResponse>("/api/auth/login", { email, password });
  await saveToken(data.token);
  return data;
}

export async function saveToken(token: string) {
  await SecureStore.setItemAsync("auth_token", token, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
}

export function getToken() {
  return SecureStore.getItemAsync("auth_token");
}

export function logout() {
  return SecureStore.deleteItemAsync("auth_token");
}
