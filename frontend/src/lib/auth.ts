import { apiPost } from "./api";

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: "Hombre" | "Mujer" | "Prefiero no decirlo" | "Otro";
};

export function register(payload: RegisterPayload) {
  return apiPost("/api/auth/register", payload);
}
