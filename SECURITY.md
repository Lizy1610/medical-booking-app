# Política de Seguridad

Este documento describe los principios de seguridad, amenazas identificadas y lineamientos aplicados en el backend del proyecto de citas médicas.

## Principios de Seguridad Aplicados

Para proteger la aplicación y los datos de los usuarios, hemos implementado las siguientes medidas:

1.  **Variables de Entorno (`.env`)**: Toda información sensible, como la cadena de conexión a la base de datos (`MONGO_URI`) y el secreto para firmar tokens (`JWT_SECRET`), se almacena en un archivo `.env` que no se sube al repositorio. Esto evita la exposición de credenciales críticas en el código fuente.

2.  **Cifrado de Contraseñas (Hashing)**: Las contraseñas de los usuarios nunca se almacenan en texto plano. Utilizamos la librería `bcryptjs` para aplicar un hash con "salt" a cada contraseña antes de guardarla en la base de datos. Esto hace que, incluso si la base de datos se viera comprometida, las contraseñas no puedan ser leídas.

3.  **Autenticación por Tokens (JWT)**: El acceso a rutas protegidas (a futuro) se gestiona mediante JSON Web Tokens (JWT). Después de un inicio de sesión exitoso, el servidor genera un token firmado que el cliente debe presentar en cada petición. El servidor verifica la firma del token para autenticar al usuario, evitando la necesidad de enviar credenciales en cada solicitud.

4.  **Control de Orígenes (CORS)**: Se utiliza la librería `cors` para controlar qué dominios de frontend tienen permitido hacer peticiones a nuestra API. Esto previene que sitios web no autorizados interactúen con nuestro backend.

## Amenazas Identificadas y Mitigación

| Amenaza | Descripción | Mitigación |
| :--- | :--- | :--- |
| **Exposición de Credenciales** | Fuga de la cadena de conexión a la BD o de la clave secreta del JWT en el repositorio de código. | Uso de variables de entorno (`.env`) y el archivo `.gitignore` para excluirlo del control de versiones. |
| **Fuga de Contraseñas de Usuario** | Si un atacante obtiene acceso a la base de datos, podría ver las contraseñas de todos los usuarios. | Las contraseñas se cifran con `bcryptjs`. El atacante solo vería hashes indescifrables. |
| **Acceso no Autorizado a Endpoints**| Un usuario malintencionado podría intentar acceder a datos o ejecutar acciones sin iniciar sesión. | Se implementa un sistema de autenticación con JWT. Las rutas sensibles (a futuro) requerirán un token válido. |
| **Inyección de Datos (NoSQL Injection)**| Un atacante podría intentar inyectar código malicioso a través de los campos de entrada para manipular la base de datos. | Se utiliza `mongoose`, que aplica un esquema estricto (`User.js`). Esto asegura que solo los datos que cumplen con el formato definido se guarden en la base de datos, mitigando ataques de inyección básicos. |

## Lineamientos de Seguridad para el Equipo

- **Nunca subir el archivo `.env` al repositorio.** Asegurarse de que `.gitignore` siempre contenga la línea `.env`.
- **Utilizar secretos fuertes.** La variable `JWT_SECRET` debe ser una cadena de texto larga, compleja y aleatoria en un entorno de producción.
- **Validar todos los datos de entrada.** Siempre se debe verificar y limpiar la información que llega en `req.body` antes de procesarla o guardarla.
- **Mantener las dependencias actualizadas** para corregir posibles vulnerabilidades de seguridad descubiertas en librerías como `express`, `jsonwebtoken`, etc.