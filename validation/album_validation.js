/* Album validation rules
*/

const { body } = require('express-validator');
const models = require('../models');

/**
 * Regler för att lägga till ett nytt album
 * POST /albums
 * 
 * Required: title, 
 */
const createRules = [
    body('title').exists().isLength({ min:3 }).custom(async value => {
		const title = await new models.album_model({ title: value }).fetch({ require: false });
		if (title) {
			return Promise.reject("Title already exists.");
		}
		return Promise.resolve();
	}),
];

/**
 * Regler för att uppdatera ett album
 * PUT /albums/:albumId
 * 
 * Required: title, album_id 
 */
const updateRules = [
    body('title').exists().isLength({ min:3 }),
];

module.exports = {
    createRules,
    updateRules
};
