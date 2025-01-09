const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const booksCtrl = require('../controllers/books');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const validateId = (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    next();
};

router.get('/', auth, booksCtrl.getAllBooks);
router.post('/', auth, multer, booksCtrl.createBook);
router.get('/:id', auth, validateId, booksCtrl.getOneBook);
router.put('/:id', auth, multer, validateId, booksCtrl.modifyBook);
router.delete('/:id', auth, validateId, booksCtrl.deleteBook);

module.exports = router;

