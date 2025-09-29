
# README (Frontend – React Native / Expo + TypeScript)

## 1) Instrucciones para correr la app

### Requisitos
- Node.js 18+
- Expo CLI (`npm i -g expo`)
- Android Studio (emulador) o dispositivo físico con Expo Go

### Instalación y ejecución
```bash
# instalar dependencias
npm i

# ejecutar en desarrollo
npx expo start

# abrir en Android (emulador)
a  # (desde la interfaz de Expo)
# o usar QR en Expo Go para dispositivo físico
````

### Variables de entorno (si aplican)

* Define tus URLs y llaves en `app.config.ts` o usando `expo-constants`.
* No subas secretos a git. Usa `.gitignore`.

## 2) Dependencias / librerías usadas

* **expo** y **react-native** – base del proyecto
* **expo-router** – navegación por rutas
* **@expo-google-fonts/poppins** – tipografías
* **@react-native-community/datetimepicker** – selector de fecha
* **expo-image-picker** – selección de imágenes/galería
* **expo-secure-store** – almacenamiento seguro del token JWT
* **react-native-maps** – mapas (Google Maps)
* **@expo/vector-icons (Ionicons)** – iconografía

*(Ajusta esta lista a lo que tengas realmente en `package.json`.)*

## 3) Ejemplo de integración de la API

### Configuración base

```ts
// src/lib/api.ts
import { Platform } from "react-native";

export const API_BASE = __DEV__
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
```

### Auth (registro / login / me)

```ts
// src/lib/session.ts
import * as SecureStore from "expo-secure-store";
const KEY = "auth_token";
export const saveToken = (t: string) => SecureStore.setItemAsync(KEY, t);
export const getToken = () => SecureStore.getItemAsync(KEY);
export const clearToken = () => SecureStore.deleteItemAsync(KEY);
```

```ts
// src/lib/auth.ts
import { apiPost, API_BASE } from "./api";
import { saveToken, getToken } from "./session";

export function register(data: {
  name: string;
  username: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: "Hombre" | "Mujer" | "Prefiero no decirlo" | "Otro";
}) {
  return apiPost("/api/auth/register", data);
}

export async function login(email: string, password: string) {
  const json = await apiPost("/api/auth/login", { email, password });
  await saveToken(json.token);
  return json.user;
}

export async function me() {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Token inválido");
  return res.json();
}
```

### Uso en pantallas

```ts
// Ejemplo: RegisterScreen -> ProfileSetupScreen -> register()
// 1) Captura name, email, password y pásalos por params.
// 2) En ProfileSetupScreen, completa username, dateOfBirth, gender y llama a register(data).
```

## 4) Integración de Google Maps (react-native-maps)

### Instalación

```bash
npx expo install react-native-maps
```

### Configuración (Android)

* Crea tu API Key de **Google Maps** y **restringe** por paquete + SHA-1.
* Añade la key en `android/app/src/main/AndroidManifest.xml` (si config plugin lo requiere) o vía `app.config.ts`.

### Ejemplo mínimo

```tsx
// MapScreen.tsx
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";

export default function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 19.4326,
          longitude: -99.1332,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: 19.4326, longitude: -99.1332 }} title="Centro médico" />
      </MapView>
    </View>
  );
}
```

## 5) Notas de seguridad (resumen)

* Todo tráfico sobre **HTTPS**.
* Token JWT en **SecureStore**; limpiar en logout/401.
* **No** subir llaves ni `.env` al repo. Usar `.gitignore`.
* Pedir permisos **just-in-time** y mínimos.

## 6) Troubleshooting

* Emulador Android no llega a `localhost` → usar `http://10.0.2.2:4000`.
* Cert auto-firmado en dev puede fallar en Android → usar HTTP local o túnel (ngrok).
* Errores 401 → el token expiró o es inválido; rehacer login.

```