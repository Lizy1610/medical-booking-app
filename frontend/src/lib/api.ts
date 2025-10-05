import { Platform } from "react-native";

const NGROK_URL = "https://ungamy-pseudoaffectionately-roselyn.ngrok-free.dev";

export const API_BASE =
  NGROK_URL ||
  (__DEV__
    ? (Platform.OS === "android" ? "http://10.0.2.2:4000" : "https://localhost:4000")
    : "https://tu-dominio.com");

export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (json && (json.message || json.error)) ||
      (Array.isArray(json?.errors) ? json.errors[0]?.msg : "") ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json as T;
}
