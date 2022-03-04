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
router.use('/album', require('./album'));
//router.use('/album', auth.validateJwtToken, require('./album'));
//router.use('/photos', require('./photos'));
// ** DENNA MÅSTE FUNKA FÖR ATT ROUTES/ALBUM SKA FUNKA         
//router.use('/user', auth.validateJwtToken, require('./user')); 

// login a user and get a JWT 
router.post('/login', authController.login);

// register a new user
router.post('/register', userValidationRules.createRules, authController.register);


module.exports = router;