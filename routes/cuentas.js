const router = require('express').Router();
const {
  crearCuenta,
  obtenerCuenta,
  obtenerCuentas,
  modificarCuenta
//   eliminarCuenta
} = require('../controllers/cuentas')

router.get('/', obtenerCuentas)
router.get('/:id', obtenerCuenta) //Nuevo endpoint con todos los detalles de Cuenta
router.post('/', crearCuenta)
router.put('/:id', modificarCuenta)
// router.delete('/:id', eliminarCuenta)

module.exports = router;