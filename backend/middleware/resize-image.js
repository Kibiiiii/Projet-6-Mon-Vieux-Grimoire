const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const originalPath = path.join(__dirname, '../images', req.file.filename);
        const resizedPath = path.join(__dirname, '../images', 'thumb_' + req.file.filename);

        // Redimensionner l'image à 300x300 pixels
        await sharp(originalPath)
            .resize(300, 300)
            .toFile(resizedPath);

        // Supprimer l'ancienne image non redimensionnée
        fs.unlink(originalPath, (err) => {
            if (err) console.error('Erreur lors de la suppression de l\'ancienne image:', err);
        });

        // Mettre à jour `req.file.filename` pour pointer vers la nouvelle image
        req.file.filename = 'thumb_' + req.file.filename;
        next();
    } catch (error) {
        console.error('Erreur lors du traitement de l\'image avec sharp:', error);
        res.status(500).json({ error: 'Erreur lors du traitement de l\'image.' });
    }
};
