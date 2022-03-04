const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album_validation');

/* Hämta alla album */
// GET /albums
router.get('/albums', albumController.index);

/* Get a specific resource */
router.get('/:albumId', albumController.show);

/* Lägg till ett album */
// POST /albums
router.post('/albums', albumValidationRules.createRules, albumController.store);

/* Uppdatera ett album */
// PUT /albums/:albumId
router.put('/albums/:albumId', albumValidationRules.updateRules, albumController.update);

module.exports = router;


/* Lägg till ett album till den inloggade användaren */
// POST /albums
router.post('/albums', auth.validateJwtToken, profileValidationRules.addAlbumRules, profileController.addAlbum);

/* Uppdatera ett album */
// PUT /albums/:albumId
router.put('/albums/:albumId', profileValidationRules.updateRules, profileController.updateAlbum);