const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController');
const auth = require('../middleware/auth');

// Subida de archivos
//const multer = require(multer);
//const upload = multer({ dest: './uploads/' });

router.post('/',
    //upload.single('archivo'),
    auth,
    archivosController.subirArchivo
);

router.get('/:archivo',
    archivosController.descargar,
    archivosController.eliminarArchivo
);


module.exports = router;