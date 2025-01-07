const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const booksCtrl = require('../controllers/books');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Middleware pour valider l'ID
const validateId = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    next();
};

router.get('/', auth, booksCtrl.getAllBooks);
router.post('/', auth, booksCtrl.createBook);
router.get('/:id', auth, validateId, booksCtrl.getOneBook);
router.put('/:id', auth, validateId, booksCtrl.modifyBook);
router.delete('/:id', auth, validateId, booksCtrl.deleteBook);


module.exports = router;
