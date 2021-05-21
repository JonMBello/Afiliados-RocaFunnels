const bcrypt = require('bcryptjs');
const generarJWT = require('../helpers/generar-jwt');
const Cuenta = require('../models/Cuenta');
const Afiliado = require('../models/Afiliado');

let obtenerCuentas = async (req, res, next) => {
    try {
        const cuentas = await Cuenta.findAll();
        res.status(200).send(cuentas);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : {
                msg : 'Error del sistema, intente de nuevo más tarde o comuníquese con un asesor'
            }
        });
    }
}

let obtenerCuenta = async (req, res, next) => {
    let {id} = req.params;
    try {
        //Busca el usuario en la BD
        const usuario = await Afiliado.findByPk(id);
        //Verifica que exista el usuario
        if(!usuario) {
            return res.status(404).json({
                error : {
                    msg : 'Usuario no encontrado'
                }
            });
        }
        //Busca la cuenta de usuario
        const cuenta = await Cuenta.findOne({
            where: {
                id_cuenta : id
            }
        });
        //Verifica que exista una cuenta para este usuario en la BD
        if(!cuenta){ 
            return res.status(404).json({
                error: {
                    msg : 'Este usuario no tiene cuenta registrada'
                }
            });
        }
        //Regresa la cuenta
        res.status(200).send(cuenta);   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : {
                msg : 'Error del sistema, intente de nuevo más tarde o comuníquese con un asesor'
            }
        });
    }
}

let crearCuenta = async (req, res, next) => {
    let {body} = req;
    //Verifica que los datos necesarios vengan en la petición
    if(!body.clabe || !body.id_cuenta || !body.banco){
        return res.status(400).json({
            error : {
                msg : 'Los datos de la cuenta deben estar completos'
            }
        });
    }
    //Verificar que la clabe corresponde al formato
    let clabe = Number(body.clabe);
    console.log(body.clabe.length);
    if(body.clabe.length != 18 || Object.is(clabe, NaN)){
        return res.status(400).json({
            error : {
                msg : 'El campo clabe debe ser un número y tener 18 dígitos'
            }
        })
    }
    try {
        //Busca el usuario en BD
        const usuario = await Afiliado.findByPk(body.id_cuenta);
        if(!usuario) {
            return res.status(404).json({
                error : {
                    msg : 'Usuario no encontrado'
                }
            });
        }
        //Buscar cuenta de usuario

        //Busca el campo de clabe en BD
        const existeClabe = await Cuenta.findOne({
            where : {
                clabe : body.clabe
            }
        });
        //Verifica que no exista una clabe en la BD
        if(existeClabe){ 
            return res.status(400).json({
                error: {
                    msg : 'Ya existe un usuario con esta clabe',
                    campo : body.clabe
                }
            });
        }
        //Guarda la cuenta
        const cuenta = new Cuenta(body);
        await cuenta.save();
        //Se envían los datos de la cuenta
        res.status(201).send({cuenta});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : {
                msg : 'Error del sistema, intente de nuevo más tarde o comuníquese con un asesor'
            }
        });
    }
}

let modificarCuenta = async (req, res, next) => {
    let {body} = req;
    //Verifica que los datos necesarios vengan en la petición
    if(!body.clabe || !body.id_cuenta || !body.banco){
        return res.status(400).json({
            error : {
                msg : 'Los datos de la cuenta deben estar completos'
            }
        });
    }
    //Verificar que la clabe corresponde al formato
    let clabe = Number(body.clabe);
    console.log(body.clabe.length);
    if(body.clabe.length != 18 || Object.is(clabe, NaN)){
        return res.status(400).json({
            error : {
                msg : 'El campo clabe debe ser un número y tener 18 dígitos'
            }
        })
    }
    try {
        //Busca el usuario en BD
        const usuario = await Afiliado.findByPk(body.id_cuenta);
        if(!usuario) {
            return res.status(404).json({
                error : {
                    msg : 'Usuario no encontrado'
                }
            });
        }
        //Busca el campo de clabe en BD
        const existeClabe = await Cuenta.findOne({
            where : {
                clabe : body.clabe
            }
        });
        //Verifica que no exista una clabe en la BD
        if(existeClabe){ 
            return res.status(400).json({
                error: {
                    msg : 'Ya existe un usuario con esta clabe',
                    campo : body.telefono
                }
            });
        }
        //Guarda la cuenta
        const cuenta = new Cuenta(body);
        await cuenta.save();
        //Se envían los datos de la cuenta
        res.status(201).send({cuenta});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : {
                msg : 'Error del sistema, intente de nuevo más tarde o comuníquese con un asesor'
            }
        });
    }
}

//Función que elimina un usuario, se tiene que verificar
let eliminarCuenta = async (req, res, next) => {
   
}

module.exports = {
    obtenerCuentas,
    obtenerCuenta,
    crearCuenta,
}