const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const profileValidationRules = require('../validation/profile');

/** Hämtar den inloggade användarens profil */
router.get('/', profileController.getProfile);

/** Uppdatera den inloggade användarens uppgifter */
router.put('/', profileValidationRules.updateRules, profileController.updateProfile);

/* Hämta den inloggade användarens album */
//router.get('/albums', profileController.getAlbums);

/* Lägg till ett album till den inloggade användaren */
// POST /profile/albums
//router.post('/albums', profileValidationRules.addAlbumRules, profileController.addAlbum);

/* Hämta den inloggade användarens foton */
//router.get('/photos', profileController.getPhotos);

/* Lägg till ett foto till den inloggade användaren */
// POST /profile/photo
//router.post('/photos', profileValidationRules.addPhotoRules, profileController.addPhoto);

module.exports = router;