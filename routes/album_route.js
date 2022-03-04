const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album_validation');

/* Hämta alla album till den inloggade användaren */
// GET /albums
router.get('/', albumController.getAlbums);

/* Hämta ett specifikt album */
// GET /albums/:albumId exempelvis /albums/1
router.get('/:albumId', albumController.showAlbum);

/* Lägg till ett album */
// POST /albums
router.post('/', albumValidationRules.createRules, albumController.addAlbum);

/* Uppdatera ett album */
// PUT /albums/:albumId exempelvis /albums/1
router.put('/:albumId', albumValidationRules.updateRules, albumController.updateAlbum);

module.exports = router;
