const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // 1. Importamos axios al principio

// Función para registrar un usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    user = new User({ nombre, email, password, rol });
    await user.save(); // El usuario se guarda en la base de datos aquí

    // --- INICIO DE LA INTEGRACIÓN CON API EXTERNA ---
    try {
      // 2. Preparamos los datos que enviaremos a la API externa
      const notificationPayload = {
        title: '¡Nuevo Usuario Registrado!',
        body: `El usuario ${nombre} con el correo ${email} se ha registrado.`,
        userId: user.id // Usamos el ID del usuario recién creado
      };

      // 3. Hacemos la petición POST a la API externa con axios
      const apiResponse = await axios.post('https://jsonplaceholder.typicode.com/posts', notificationPayload);

      // 4. Mostramos la respuesta de la API en la consola de nuestro servidor
      console.log('Notificación enviada exitosamente. Respuesta de la API:', apiResponse.data);

    } catch (apiError) {
      // 5. Si la API externa falla, no detenemos el proceso, solo lo informamos en consola
      console.error('Error al enviar la notificación:', apiError.message);
    }
    // --- FIN DE LA INTEGRACIÓN ---

    // 6. Enviamos la respuesta final al cliente (Postman o la app)
    res.status(201).json({ msg: 'Usuario registrado exitosamente' });

  } catch (error) {
    // Este catch es para errores en nuestro propio servidor (ej: la BD se desconectó)
    console.error(error); // Es buena idea mostrar el error en consola
    res.status(500).send('Error en el servidor');
  }
};

// Función para iniciar sesión (sin cambios)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Comparar la contraseña ingresada con la de la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Crear y firmar el token
    const payload = { userId: user.id, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
};