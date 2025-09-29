// Cargar las variables de entorno del archivo .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Crear la aplicación de Express
const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones de otros orígenes (el frontend)
app.use(express.json()); // Permitir que el servidor entienda JSON

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('¡Conectado a MongoDB! ✅'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Puerto en el que correrá el servidor
const PORT = process.env.PORT || 5000;

// Rutas de la API 
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});