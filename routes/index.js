var router = require('express').Router();

router.get('/', (req, res, next)=>{
  res.send('API de afiliados');
});

router.use('/afiliados', require('./afiliados'));
router.use('/cuentas', require('./cuentas'));

module.exports = router;