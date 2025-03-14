const express = require('express');
const { sequelize } = require('./models'); // Importamos la conexión a la BD
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const rendicionRoutes = require('./routes/rendicionRoutes');
const coopRoutes = require('./routes/coopRoutes');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://192.168.0.93:5173',
      'http://192.168.0.112:5173',
      'http://localhost:3000',
      'http://192.168.0.151:5173',
    ],
    credentials: true,
  }),
);

// Rutas
app.use('/api/auth', authRoutes);
app.use(
  '/api',
  //verificarToken,
  usuarioRoutes,
);
app.use(
  '/api/rendiciones',
  //verificarToken,
  rendicionRoutes,
);
app.use(
  '/api/cooperativas',
  //verificarToken,
  coopRoutes,
);

// Conectar con la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Conexión establecida con la base de datos');

    // Solo sincronizar la base en desarrollo
    if (process.env.NODE_ENV === 'development') {
      return sequelize.sync({ alter: true });
    }
  })
  .then(() => {
    console.log('📦 Base de datos sincronizada');

    // Iniciar el servidor
    // app.listen(PORT, () => {
    //   console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    // });

    //Escuchar en 0.0.0.0 para que sea accesible desde la red
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://192.168.0.151:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar la base de datos:', error);
  });
