const express = require('express');
const router = express.Router();
const auth = require('../middlewears/auth');
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user_validation');

router.get('/', (req, res, next) => {
    res.send({
        success: true,
        data: { msg: 'Welcome to my photo-app' },
    });
});

// Registrera en ny användare 
router.post('/register', userValidationRules.createRules, authController.register);

// Logga in en befintlig användare
router.post('/login', authController.login);

/** Länkar till models */
router.use(auth.validateJwtToken);
router.use('/albums', require('./album_route'));
//router.use('/photos', require('./photo_route'));

module.exports = router;

