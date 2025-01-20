const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extension = file.mimetype.split('/')[1];
        callback(null, Date.now() + '.' + extension);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(new Error('Format de fichier non autorisé'), false);
    }
};

// Limite de taille : 5 Mo
const limits = {
    fileSize: 5 * 1024 * 1024 // 5 Mo en octets
};

module.exports = multer({ storage, fileFilter, limits }).single('image');


