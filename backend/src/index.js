const express = require('express');
const { sequelize } = require('./models'); // Importamos la conexión y modelos
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
//const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

app.use(express.json());
//app.use('/usuarios', rutasUsuario);

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true }) // Si se crean nuevas tablas descomentar esta linea y comentar la de "autenticar"
  .then(() => {
    console.log('Base de datos y tablas creadas');
    // .authenticate()
    // .then(() => {
    //   console.log('Conexión establecida con la base de datos');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor inicializado en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al crear la base de datos y tablas:', error);
  });
