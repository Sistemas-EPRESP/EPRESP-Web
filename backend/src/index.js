const express = require("express");
const app = express();
const port = 3000;
const sequelize = require("./config/database/db");

sequelize
  // .sync({ alter: true }) // Si se crean nuevas tablas descomentar esta linea y comentar la de "autenticar"
  // .then(() => {
  //   console.log('Base de datos y tablas creadas');
  .authenticate()
  .then(() => {
    console.log("Conexión establecida con la base de datos");

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor inicializado en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error al crear la base de datos y tablas:", error);
  });
