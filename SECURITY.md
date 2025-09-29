```
# SECURITY.md

### 1) Principios de seguridad aplicados
- Uso de **HTTPS** para todo el tráfico (TLS 1.2+).
- **Autenticación con JWT**; el token se almacena únicamente en almacenamiento seguro (Expo SecureStore / Keychain / Keystore).
- **Cifrado/local secure storage** para datos sensibles (token, identificadores de sesión, preferencias privadas).
- **Permisos mínimos y just-in-time** (cámara, fotos, ubicación), solicitados solo cuando se usan.
- **Validación de datos en cliente** (formatos, longitudes) antes de enviarlos al backend; validación estricta en el servidor.
- **Manejo de sesión seguro**: limpieza de token en logout y al recibir `401`/expiración.
- **Superficie de ataque reducida**: sin claves ni endpoints secretos hardcodeados; logs verbosos deshabilitados en producción.
- **Google Maps API** con llaves restringidas por paquete Android + SHA-1 y por APIs necesarias.

### 2) Amenazas identificadas y mitigaciones
- Fuga de token en dispositivo  
  Mitigación: guardar token solo en SecureStore; nunca en AsyncStorage; no registrar tokens/PII en logs; borrar token en logout y ante `401`.
- Ataques MITM en red  
  Mitigación: forzar HTTPS; considerar *certificate pinning* en builds de producción.
- Exposición de claves (Maps/API)  
  Mitigación: no subir claves al repositorio; usar variables de entorno; restringir la key en Google Cloud (paquete/SHA-1, cuotas y APIs necesarias).
- Permisos innecesarios o excesivos  
  Mitigación: pedir permisos mínimos, solo cuando se usan; degradar la funcionalidad si se deniegan; mensajes claros al usuario.
- Validación insuficiente del input  
  Mitigación: validación en cliente y servidor; sanitización básica; rechazo de payloads inválidos.
- Sesión expirada o inválida  
  Mitigación: detectar `401` → limpiar SecureStore y redirigir a login.
- Logs con datos sensibles  
  Mitigación: desactivar `console.*` en producción; nunca loggear tokens/PII.

### 3) Lineamientos para el equipo
- **No subir claves** (Google Maps/API) al repositorio.
- Usar **variables de entorno** / `app.config.ts` (Expo) y agregarlas a `.gitignore`.
- Restringir llaves en el proveedor (Google Cloud: paquete Android + SHA-1; solo APIs necesarias).
- Consumir únicamente **HTTPS**; adjuntar `Authorization: Bearer <token>` en requests autenticadas.
- Guardar token **siempre** en SecureStore; limpiar en logout y ante `401`.
- No incluir tokens en URLs ni parámetros de navegación.
- Mantener dependencias actualizadas y auditar vulnerabilidades periódicamente.
- Revisar PRs con checklist de seguridad: sin secretos, sin logs sensibles, permisos mínimos, manejo de errores de red, dependencias revisadas.
```
