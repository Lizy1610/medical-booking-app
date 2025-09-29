import { Platform } from "react-native";

export const API_BASE =
  __DEV__
    ? (Platform.OS === "android" ? "http://10.0.2.2:4000" : "https://localhost:4000")
    : "https://tu-dominio.com";

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Error");
  return json;
}
