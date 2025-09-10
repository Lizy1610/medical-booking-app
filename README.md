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
- main: rama principal, siempre estable y lista para producción.
- Cada nueva función o tarea se desarrolla en una rama feature creada desde main.
- Cuando la tarea termina, se hace Pull Request y tras ser revisado se une a main.

## Ramas del repositorio
- main: Rama principal y estable. Contiene la última versión lista para desplegar.
- auth: Módulo de registro, login y recuperación de contraseña.
- patient-profile:	Gestión del perfil del paciente (datos personales y médicos).
- doctor-search:	Búsqueda de médicos y visualización de su información.
- booking:	Funcionalidad para reservar una cita médica.
- reschedule-cancel:	Reprogramación y cancelación de citas médicas.
- appointments-history:	Historial de citas del paciente.
- notifications	:Notificaciones de recordatorio para citas.
- payments:	Integración opcional de pagos en línea.
