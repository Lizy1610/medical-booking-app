# Backend para Citas Médicas 🩺

Este es el repositorio del backend para la aplicación de gestión de citas médicas, construido con Node.js, Express y MongoDB.

## Instrucciones para Correr la App

Para levantar el servidor en un entorno local, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DE_TU_REPOSITORIO>
    cd citas-medicas-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto y añade las siguientes variables:
    ```
    MONGO_URI=mongodb://127.0.0.1:27017/citasMedicasDB
    JWT_SECRET=ESTA_ES_UNA_CLAVE_SECRETA_MUY_LARGA_Y_DIFICIL
    ```

4.  **Iniciar el servidor:**
    ```bash
    node index.js
    ```
    El servidor estará corriendo en `http://localhost:5000`.

## Dependencias Utilizadas

- **Express**: Framework para construir el servidor y la API REST.
- **Mongoose**: ODM para modelar y comunicarnos con la base de datos MongoDB.
- **bcryptjs**: Para cifrar (hash) las contraseñas de los usuarios.
- **jsonwebtoken**: Para generar tokens de autenticación (JWT).
- **cors**: Middleware para habilitar el Cross-Origin Resource Sharing.
- **dotenv**: Para manejar variables de entorno desde un archivo `.env`.
- **axios**: Para realizar peticiones HTTP a APIs externas.

## Ejemplo de Integración con API Externa

Al registrar un nuevo usuario, se realiza una llamada a la API pública de pruebas `JSONPlaceholder` para simular el envío de una notificación.

**Ubicación del código:** `controllers/authController.js`

```javascript
// ...después de guardar el usuario
await user.save();

// --- INICIO DE LA INTEGRACIÓN CON API EXTERNA ---
try {
  const notificationPayload = {
    title: '¡Nuevo Usuario Registrado!',
    body: `El usuario ${nombre} con el correo ${email} se ha registrado.`,
    userId: user.id
  };

  // Hacemos una petición POST a la API externa
  const apiResponse = await axios.post('[https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)', notificationPayload);

  console.log('Notificación enviada exitosamente. Respuesta de la API:', apiResponse.data);

} catch (apiError) {
  // Si la API externa falla, no detenemos el registro, solo lo informamos
  console.error('Error al enviar la notificación:', apiError.message);
}
// --- FIN DE LA INTEGRACIÓN ---
```
