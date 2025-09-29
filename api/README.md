# MedAPI — Backend (Node + Express + MySQL)

API mínima para **registro**, **login** y **perfil** (`/me`) usando **JWT**. Incluye medidas de seguridad básicas (**Helmet**, **CORS**, **Rate-Limit**) y **HTTPS en desarrollo**. Pensada para integrarse con una app móvil (React Native / Expo).

---

## 📦 Requisitos

- **Node.js** 18+
- **MySQL** 5.7 / 8.x
- Opcional: `openssl` o **PowerShell** para certificados locales
- Opcional: **ngrok** si necesitas una URL HTTPS pública para probar en móvil

---

## 🗂 Estructura del proyecto

backend/
certs/ # opcional (HTTPS local)
key.pem
cert.pem
src/
server.js
db.js
authRoutes.js
authMiddleware.js
.env # NO subir a git
package.json
README.md

shell
Copiar código

> Asegúrate de ignorar secretos:
>
> ```gitignore
> node_modules/
> .env
> certs/
> *.pem
> *.pfx
> .DS_Store
> ```

---

## ⚙️ Instalación

En la carpeta `backend/`:

```bash
npm i
🗄️ Configuración de base de datos
Ejecuta una sola vez en MySQL (Workbench o consola):

sql
Copiar código
CREATE DATABASE IF NOT EXISTS medapp
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medapp;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  date_of_birth DATE NULL,
  gender ENUM('Hombre','Mujer','Prefiero no decirlo','Otro') NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
🔐 Variables de entorno
Crea un archivo .env en backend/:

ini
Copiar código
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_pass
DB_NAME=medapp
DB_PORT=3306

JWT_SECRET=cadena_larga_unica_segura

# HTTPS local (opcional). Si estos archivos no existen, el server arranca en HTTP.
HTTPS_KEY=./certs/key.pem
HTTPS_CERT=./certs/cert.pem

# Durante desarrollo puedes dejar *; en prod, limita al dominio de tu app.
CORS_ORIGIN=*
🔒 Certificados (opcional, solo para HTTPS local)
Git Bash / WSL / macOS / Linux:

bash
Copiar código
mkdir -p certs
MSYS2_ARG_CONV_EXCL='*' openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/key.pem -out certs/cert.pem \
  -days 365 -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost"
Si no generas certificados, el servidor usará HTTP automáticamente.

▶️ Ejecutar
bash
Copiar código
# desarrollo
npm run dev

# producción simple
npm start
HTTP: http://localhost:4000

HTTPS local: https://localhost:4000 (auto-firmado; el navegador mostrará “No es seguro”, es normal en dev)

Emulador Android

HTTP local: http://10.0.2.2:4000

Android no confía en certificados auto-firmados: usa HTTP o un túnel como ngrok.

ngrok (opcional)

bash
Copiar código
ngrok http 4000
# usa la URL https://xxxxx.ngrok-free.app en la app móvil
🔌 Endpoints
Base URL: http://localhost:4000 (ajusta según tu entorno)

POST /api/auth/register
Body (JSON):

json
Copiar código
{
  "name": "Ana Torres",
  "username": "ana.torres",
  "email": "ana@example.com",
  "password": "Secreta123!",
  "dateOfBirth": "1998-07-21",
  "gender": "Mujer"
}
Respuestas: 201 Created o errores de validación/duplicados.

POST /api/auth/login
Body (JSON):

json
Copiar código
{ "email": "ana@example.com", "password": "Secreta123!" }
Respuesta:

json
Copiar código
{
  "token": "JWT_AQUI",
  "user": {
    "id": 1,
    "name": "Ana Torres",
    "username": "ana.torres",
    "email": "ana@example.com",
    "dateOfBirth": "1998-07-21",
    "gender": "Mujer"
  }
}
GET /api/me
Headers:

makefile
Copiar código
Authorization: Bearer <token>
Devuelve los datos del usuario autenticado.

GET /health
Estado del servicio y de la conexión a la base de datos.

🧩 Dependencias principales
express – servidor HTTP

mysql2 – cliente MySQL (promesas)

dotenv – variables de entorno

helmet – cabeceras de seguridad

cors – control de orígenes

express-rate-limit – límite de peticiones

express-validator – validación de inputs

bcryptjs – hash de contraseñas

jsonwebtoken – JWT

https / fs – soporte HTTPS local

🤝 Integración con React Native (Expo)
ts
Copiar código
// api.ts
export const API_BASE = __DEV__ ? "http://10.0.2.2:4000" : "https://tu-dominio.com";
ts
Copiar código
// authStorage.ts
import * as SecureStore from "expo-secure-store";

export const saveToken = (t: string) =>
  SecureStore.setItemAsync("auth_token", t, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK });

export const getToken = () => SecureStore.getItemAsync("auth_token");
export const clearToken = () => SecureStore.deleteItemAsync("auth_token");
ts
Copiar código
// authApi.ts
import { API_BASE } from "./api";
import { saveToken, getToken } from "./authStorage";

export async function register(data: {
  name: string; username: string; email: string; password: string;
  dateOfBirth?: string; gender?: "Hombre"|"Mujer"|"Prefiero no decirlo"|"Otro";
}) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Registro falló");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales inválidas");
  const json = await res.json();
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
🛠️ Troubleshooting
{"status":"ok","db":false} → revisa credenciales/puerto de MySQL en .env.

ER_ACCESS_DENIED_ERROR → usuario/contraseña/privilegios de MySQL incorrectos.

HTTPS local “No es seguro” → esperado con certificado auto-firmado.

Android no conecta a localhost → usa http://10.0.2.2:4000 o ngrok.

401 en /me → token ausente/expirado; repite login y envíalo en Authorization.

📄 Licencia
Uso interno / educativo. Adáptalo a tu licencia preferida.

makefile
Copiar código
::contentReference[oaicite:0]{index=0}
