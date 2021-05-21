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
    //Verificar que la CLABE corresponde al formato
    let clabe = Number(body.clabe);
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
        //Busca si el usuario tiene una cuenta
        const cuenta = await Cuenta.findOne({
            where: {
                id_cuenta : body.id_cuenta
            }
        });
        //Verifica que no exista una cuenta para este usuario en la BD
        if(cuenta){ 
            return res.status(400).json({
                error: {
                    msg : 'Este usuario ya tiene una cuenta registrada'
                }
            });
        }
        //Busca el campo de clabe en BD
        const existeClabe = await Cuenta.findOne({
            where : {
                clabe : body.clabe
            }
        });
        //Verifica que no exista esta clabe en la BD
        if(existeClabe){ 
            return res.status(400).json({
                error: {
                    msg : 'Ya existe un usuario con esta clabe',
                    campo : body.clabe
                }
            });
        }
        //Crea la cuenta
        const cuentaNueva = new Cuenta(body);
        //Guarda la cuenta
        await cuentaNueva.save();
        //Se envían los datos de la cuenta nueva
        res.status(201).send({cuenta : cuentaNueva});
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
    let {id} = req.params;
    let {body} = req;
    //Verifica que los datos necesarios vengan en la petición
    if(!body.clabe || !id || !body.banco){
        return res.status(400).json({
            error : {
                msg : 'Los datos de la cuenta deben estar completos'
            }
        });
    }
    //Verificar que la CLABE corresponde al formato
    let clabe = Number(body.clabe);
    if(body.clabe.length != 18 || Object.is(clabe, NaN)){
        return res.status(400).json({
            error : {
                msg : 'El campo clabe debe ser un número y tener 18 dígitos'
            }
        })
    }
    try {
        //Busca el usuario en BD
        const usuario = await Afiliado.findByPk(id);
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
        //Verifica que no exista esta clabe en la BD
        if(existeClabe){ 
            return res.status(400).json({
                error: {
                    msg : 'Ya existe un usuario con esta clabe',
                    campo : body.clabe
                }
            });
        }
        //Busca la cuenta del usuario
        const cuenta = await Cuenta.findOne({
            where: {
                id_cuenta : id
            }
        });
        //Actualiza los datos
        await cuenta.update(body,{"raw":"true"});
        //Se envían los datos de la cuenta nueva
        res.status(200).send({cuenta});
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
    let {id} = req.params;
    //Verifica que el ID venga en la petición
    if(!id){
        return res.status(400).json({
            error : {
                msg : 'El ID del usuario es necesario'
            }
        });
    }
    try {
        //Busca el usuario en BD
        const usuario = await Afiliado.findByPk(id);
        if(!usuario) {
            return res.status(404).json({
                error : {
                    msg : 'Usuario no encontrado'
                }
            });
        }
        //Busca la cuenta del usuario
        const cuenta = await Cuenta.findOne({
            where: {
                id_cuenta : id
            }
        });
        //Verifica que el usuario tenga una cuenta registrada
        if(!cuenta){ 
            return res.status(404).json({
                error: {
                    msg : 'Este usuario no tiene una cuenta registrada'
                }
            });
        }
        //Opción de eliminar físicamente usuario
        cuenta.destroy();
        //Opción de eliminar lógicamente usuario - falta


        //Se envían la respuesta
        res.status(200).send(`Cuenta del usuario ${id} eliminada`);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error : {
                msg : 'Error del sistema, intente de nuevo más tarde o comuníquese con un asesor'
            }
        });
    }
}

module.exports = {
    obtenerCuentas,
    obtenerCuenta,
    crearCuenta,
    modificarCuenta
}