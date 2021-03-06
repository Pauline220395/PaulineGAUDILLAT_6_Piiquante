//Logique de routing
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // ":" = paramètre de route dynamique
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;