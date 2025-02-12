const express = require('express');
const { sequelize } = require('./models'); // Importamos la conexión a la BD
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api', authRoutes);

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
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar la base de datos:', error);
  });
