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

router.get('/', auth, booksCtrl.getAllStuff);
router.post('/', auth, booksCtrl.createThing);
router.get('/:id', auth, validateId, booksCtrl.getOneThing);
router.put('/:id', auth, validateId, booksCtrl.modifyThing);
router.delete('/:id', auth, validateId, booksCtrl.deleteThing);

module.exports = router;
