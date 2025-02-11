const Usuario = require('./Usuario');
const Cooperativa = require('./Cooperativa');
const Administrador = require('./Administrador');

// 🔗 Relación Cooperativa - Usuario (Uno a Uno)
Cooperativa.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasOne(Cooperativa, { foreignKey: 'usuarioId' });

// 🔗 Relación Administrador - Usuario (Uno a Uno)
Administrador.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasOne(Administrador, { foreignKey: 'usuarioId' });

module.exports = { Usuario, Cooperativa, Administrador };
