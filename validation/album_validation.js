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
    body('title').exists().isString().isLength({ min:3 }).custom(async value => {
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
    body('title').exists().isString().isLength({ min:3 }),
];

/**
  * Regler för att lägga till ett foto i ett album
  *
  * Required: photo_id
  */
 const addPhotoToAlbumRules = [
	body('photo_id').exists().isInt().bail().custom(async value => {
		const photo = await new models.photo_model({ id: value }).fetch({ require: false });
		if (!photo) {
			return Promise.reject(`Photo with ID ${value} does not exist.`);
		}

		return Promise.resolve();
	}),
];

module.exports = {
    createRules,
    updateRules,
	addPhotoToAlbumRules,
};


