const express = require('express');
const auth = require('auth');
const router = express.Router();
const Thing = require('../models/Thing');

const stuffCtrl = require('../controllers/stuff');

router.post('/', auth, stuffCtrl.createThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllStuff);

module.exports = router;