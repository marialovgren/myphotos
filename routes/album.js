const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');
const auth = require('../middlewears/auth');

/* Hämta den inloggade användarens album */
// GET /albums
router.get('/albums', albumController.getAlbums);

/* Lägg till ett album till den inloggade användaren */
// POST /albums
router.post('/albums', auth.validateJwtToken, albumValidationRules.addAlbumRules, albumController.addAlbum);

/* Uppdatera ett album */
// PUT /albums/:albumId
router.put('/albums/:albumId', albumValidationRules.updateRules, albumController.updateAlbum);


module.exports = router;