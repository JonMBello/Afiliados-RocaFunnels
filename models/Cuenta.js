let {DataTypes, Deferrable} = require('sequelize');
let {db} = require('../db');
const Afiliado = require('./Afiliado');

const Cuenta = db.define('Cuenta', {
    clabe : {
        type : DataTypes.STRING,
        primaryKey: true
    },
    banco : {
        type : DataTypes.STRING
    },
    cuenta_bancaria : {
        type : DataTypes.STRING
    },
    id_cuenta : {
    type: DataTypes.INTEGER,
    references: {
        // This is a reference to Afiliado model
        model: Afiliado,
        // This is the column name of the referenced model
        key: 'id',
        // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
        deferrable: Deferrable.INITIALLY_IMMEDIATE
        }
    }
},
{
    tableName: 'Cuentas'
});

module.exports = Cuenta;