const { Sequelize } = require('sequelize');

const db = new Sequelize('afiliados-db', 'root', 'Roca*21£', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
});

let conectarBD = async () => {
    try {
        await db.authenticate();
        console.log('Connexión a la base de datos establecida.');
    } catch (error) {
        console.error('No fue posible conectarse a la base de datos:', error);
    }
}

module.exports = {conectarBD, db};
