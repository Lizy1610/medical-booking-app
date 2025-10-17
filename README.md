# Medical Booking App
Aplicación móvil para la reserva de citas médicas, con autenticación segura e integración en la nube.
El objetivo es permitir que los pacientes puedan registrarse, iniciar sesión, buscar médicos por especialidad o ubicación, y reservar citas de manera rápida y sencilla.

## Funcionalidades principales
- Registro e inicio de sesión de pacientes.
- Perfil del paciente con información personal.
- Búsqueda de médicos por especialidad.
- Reserva, reprogramación y cancelación de citas.
- Historial de citas anteriores.
- Notificaciones de recordatorio.
- Pagos en línea.

## Flujo de ramas (GitHub Flow)
- **main** → Rama principal, siempre estable y lista para producción.
- **feature/** → Se utiliza para el desarrollo de nuevas funcionalidades o pantallas.  
  Ejemplo: `feature/login-screen` o `feature/doctor-profile`.
- **fix/** → Se usa para corrección de errores.  
  Ejemplo: `fix/login-validation`.
- **test/** → Se usa para la implementación y ejecución de pruebas unitarias.
- Cada nueva funcionalidad o corrección se desarrolla en su respectiva rama creada desde `main`.
- Al finalizar, se crea un Pull Request hacia `main` y, tras la revisión, se fusiona.
