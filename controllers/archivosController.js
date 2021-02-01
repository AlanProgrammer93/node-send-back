const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');


exports.subirArchivo2 = async (req, res, next) => {

    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            distination: (req, file, cb) => {
                cb(null, '../uploads/')
            },
            filename: (req, file, cb) => {
                /* const extension = file.mimetype.split('/')[1]; */
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
            /* fileFilter: (req, file, cb) => {
                if (file.mimetype === "application/pdf") {
                    return cb(null, true);
                }
            } */
        })
    }

    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        console.log(req.file);
        if (!error) {
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.subirArchivo = async (req, res, next) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, __dirname+'/../uploads')
        },
        filename: function (req, file, cb) {
            const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
            cb(null, `${shortid.generate()}${extension}`);
        }
      })

    var upload = multer({ storage: storage }).single('archivo');

    upload(req, res, async (error) => {
        console.log(req.file);
        if (!error) {
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
}


exports.eliminarArchivo = async (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    } catch (error) {
        console.log(error);
    }
}

exports.descargar = async (req, res, next) => {

    // Obtiene el enlace
    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo });
    
    // Si enlace es nulo mostrar "URL invalida"

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    
    res.download(archivoDescarga);
    
    // Eliminar el archivo y la entrada de la BD
    const { descargas, nombre } = enlace;

    if (descargas === 1) {
        // Eliminar el archivo
        req.archivo = nombre;

        // Eliminar la entrada de la bd
        await Enlaces.findOneAndRemove(enlace.id);

        next();
    } else {
        enlace.descargas--;
        await enlace.save();
    }
}