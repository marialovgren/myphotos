const express = require('express');
const router = express.Router();
const auth = require('../middlewears/auth');
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user');

/** Länkar till models */
router.use('/albums', require('./album'));
//router.use('/album', auth.validateJwtToken, require('./album'));
//router.use('/photos', require('./photos'));
// ** DENNA MÅSTE FUNKA FÖR ATT ROUTES/ALBUM SKA FUNKA         
//router.use('/user', auth.validateJwtToken, require('./user')); 

// register a new user
router.post('/register', userValidationRules.createRules, authController.register);


module.exports = router;