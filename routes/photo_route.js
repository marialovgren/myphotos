const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photo_validation');

/* Hämta alla foton till den inloggade användaren */
// GET /photos
router.get('/', photoController.getPhotos);

/* Hämta ett specifikt foto */
// GET /photos/:photoId exempelvis /photos/1
router.get('/:photoId', photoController.showPhoto);

/* Lägg till ett foto */
// POST /photos
router.post('/', photoValidationRules.createRules, photoController.addPhoto);

/* Uppdatera ett foto */
// PUT /photos/:photoId exempelvis /photos/1
router.put('/:photoId', photoValidationRules.updateRules, photoController.updatePhoto);

module.exports = router;
