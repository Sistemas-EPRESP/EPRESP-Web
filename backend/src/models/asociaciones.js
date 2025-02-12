const Usuario = require('./Usuario');
const Cooperativa = require('./Cooperativa');
const Administrador = require('./Administrador');
const Rendicion = require('./Rendicion');
const Demanda = require('./Demanda');

// 🔗 Relación Cooperativa - Usuario (Uno a Uno)
Cooperativa.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasOne(Cooperativa, { foreignKey: 'usuarioId' });

// 🔗 Relación Administrador - Usuario (Uno a Uno)
Administrador.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasOne(Administrador, { foreignKey: 'usuarioId' });

// Relación Cooperativa - Rendicion (Uno a Muchos)
Cooperativa.hasMany(Rendicion, { foreignKey: 'cooperativaId' }); // Agregamos esta línea para indicar la relación
Rendicion.belongsTo(Cooperativa, { foreignKey: 'cooperativaId' }); // La clave foránea es cooperativaId

// Relación Rendicion - Demanda (Uno a Muchos)
Rendicion.hasMany(Demanda, { foreignKey: 'rendicionId' });
Demanda.belongsTo(Rendicion, { foreignKey: 'rendicionId' });

module.exports = { Usuario, Cooperativa, Administrador, Rendicion, Demanda };
