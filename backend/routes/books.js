const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const resizeImage = require('../middleware/resize-image'); // Importer le middleware Sharp
const booksCtrl = require('../controllers/books');

// Routes
router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer, resizeImage, booksCtrl.createBook);
router.get('/bestrating', booksCtrl.bestRating);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, resizeImage, booksCtrl.modifyBook); // Route modifiée
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.rateBook);

module.exports = router;

