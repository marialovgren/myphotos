/* User validation rules
*/

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('email').exists().isLength({ min: 3 }).custom(async value => {
		const user = await new models.User({ email: value }).fetch({ require: false });
		if (user) {
			return Promise.reject("Email already exists.");
		}
		return Promise.resolve();
	}),
	body('password').exists().isLength({ min: 6 }),
	body('first_name').exists().isLength({ min: 3 }),
	body('last_name').exists().isLength({ min: 3 }),
];

// allow only password, first_name, last_name to be updated abd only optionally
const updateRules = [
    body('password').optional().isLength({ min:6 }),
    body('first_name').optional().isLength({ min:3 }),
    body('last_name').optional().isLength({ min:3 })
];

module.exports = {
    updateRules,
    createRules
};