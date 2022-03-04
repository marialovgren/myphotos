const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const profileValidationRules = require('../validation/album');
const auth = require('../middlewears/auth');

/* Hämta den inloggade användarens album */
// GET /albums
router.get('/user', profileController.getProfile);

/* Lägg till ett album till den inloggade användaren */
// POST /albums
router.post('/albums', auth.validateJwtToken, profileValidationRules.addAlbumRules, profileController.addAlbum);

/* Uppdatera ett album */
// PUT /albums/:albumId
router.put('/albums/:albumId', profileValidationRules.updateRules, profileController.updateAlbum);


module.exports = router;