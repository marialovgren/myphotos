/* Photo validation rules
*/

const { body } = require('express-validator');
const models = require('../models');

/**
* * Regler för att lägga till ett nytt foto
* 
* POST /photos
* 
* Required: title, url
*/
const createRules = [
    body('title').exists().isString().isLength({ min:3 }).custom(async value => {
		const title = await new models.photo_model({ title: value }).fetch({ require: false });
		if (title) {
			return Promise.reject("Title already exists.");
		}
		return Promise.resolve();
	}),
    body('url').exists().isURL().isString(),
    body('comment').optional().isString().isLength({ min: 3 }),
];

/**
* * Regler för att uppdatera ett foto
* 
* PUT /photos/:photoId
*/
const updateRules = [
    body('title').optional().isString().isLength({ min:3 }),
    body('url').optional().isURL().isString(),
    body('comment').optional().isString().isLength({ min: 3 }),
];

module.exports = {
    createRules,
    updateRules
};
