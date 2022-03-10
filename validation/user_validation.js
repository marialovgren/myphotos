/* User validation 
*/

const { body } = require('express-validator');
const models = require('../models');

/**
* * Regler för att registrera en användare
* 
* POST /register
* 
* Required: email, password, first_name, last_name
*/
const createRules = [
	body('email').exists().isEmail().isString().custom(async value => {
		const user = await new models.user_model({ email: value }).fetch({ require: false });
		if (user) {
			return Promise.reject("Email already exists.");
		}
		return Promise.resolve();
	}),
	body('password').exists().isString().isLength({ min: 6 }),
	body('first_name').exists().isString().isLength({ min: 3 }),
	body('last_name').exists().isString().isLength({ min: 3 }),
];

module.exports = {
    createRules
};