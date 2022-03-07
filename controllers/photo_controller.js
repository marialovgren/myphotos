/**
* Photo Controller
*/

const debug = require('debug')('myphotos:photo_controller'); 
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
 
/**
* * Hämta alla foton till den inloggade användaren 
*
* GET /photos
*/
const getPhotos = async (req, res) => {
	const user = await models.user_model.fetchById(req.user_model.user_id, { withRelated: ['photos'] });
 
	res.status(200).send({
		 status: 'success',
		 data: user.related('photos')
	 });
 };
 
/**
* Hämta ett specifikt foto 
* GET /photos/:photoId
*/
const showPhoto = async (req, res) => {
	// Hämta användaren
	const user = await models.user_model.fetchById(req.user_model.user_id, { withRelated: ['photos'] });

	// Hämta användarens alla foton
	const allPhotos = user.related('photos');

	// Plocka ut ett specifikt foto genom att skriva ex. /1 i sökvägen för att få ut foto med id 1.
	const photoWithSpecificId = allPhotos.find(photo => photo.id == req.params.photoId);

	if (!photoWithSpecificId) {
		return res.status(404).send({
			status: 'fail',
			message: 'Photo with that ID was not found',
		});
	}

	res.send({
		status: 'success',
		data: {
			id: photoWithSpecificId.id,
			title: photoWithSpecificId.get('title'),
            url: photoWithSpecificId.get('url'),
            comment: photoWithSpecificId.get('comment'),
		}
	});
};
 
/**
* * Lägg till ett nytt foto
*
* * POST /photos
*/
const addPhoto = async (req, res) => {
	// Hämta användaren
	const user = await models.user_model.fetchById(req.user_model.user_id, { withRelated: ['photos'] });

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}
	const validData = matchedData(req);

	validData.user_id = req.user_model.user_id;
 
	try {
		const photo = await new models.photo_model(validData).save();
		debug("Created new photo successfully: %O", photo);

		res.send({
			status: 'success',
			data: {
				title: photo.get('title'),
                url: photo.get('url'),
                comment: photo.get('url'),
				user_id: user.id,
				id: album.get('id'),
			}
		});
 
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new Photo.',
		});
		throw error;
	}
}
 
/**
* * Uppdatera ett album 
*
* * PUT /albums/:albumId
*/
const updateAlbum = async (req, res) => {
	// Hämta användaren 
	const user = await models.user_model.fetchById(req.user_model.user_id, { withRelated: ['albums'] });

	const albumId = req.params.albumId;
 
	const album = await new models.album_model({ id: albumId }).fetch({ require: false });
	if (!album) {
		debug("Album to update was not found. %o", { id: albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}
 
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}
 
	const validData = matchedData(req);
 
	try {
		const updatedAlbum = await album.save(validData);
		debug("Updated album successfully: %O", updatedAlbum);
 
		res.send({
			status: 'success',
			data: {
				title: album.get('title'),
				user_id: user.id,
				id: album.get('id'),
			},
		});
 
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new album.',
		});
		throw error;
	}
};

module.exports = {
	getAlbums,
	showAlbum,
	addAlbum,
	updateAlbum,
}

