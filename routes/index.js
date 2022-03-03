const express = require('express');
const router = express.Router();
const auth = require('../middlewears/auth');
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

/** Länkar till models */
//router.use('/albums', require('./albums'));
//router.use('/photos', require('./photos'));
router.use('/profile', auth.validateJwtToken, require('./profile')); // funktionen heter validateJwtToken och modulen heter auth

// login a user and get a JWT 
// router.post('/login', authController.login);

// register a new user
router.post('/register', userValidationRules.createRules, authController.register);


module.exports = router;