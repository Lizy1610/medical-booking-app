import { Platform } from "react-native";

// Configuración de API - usa IP del emulador para desarrollo móvil
const API_BASE_URL = "http://10.0.2.2:4000";

export const API_BASE = API_BASE_URL;

export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
  console.log(`🚀 Enviando petición a: ${API_BASE}${path}`);
  console.log(`📦 Datos:`, body);
  
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log(`📡 Respuesta del servidor:`, res.status, res.statusText);
    
    const json = await res.json().catch(() => ({}));
    console.log(`📄 Respuesta JSON:`, json);
    
    if (!res.ok) {
      const msg =
        (json && (json.message || json.error)) ||
        (Array.isArray(json?.errors) ? json.errors[0]?.msg : "") ||
        `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return json as T;
  } catch (error) {
    console.error(`❌ Error en la petición:`, error);
    throw error;
  }
}