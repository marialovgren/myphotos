/**
* Album Controller
*/

const debug = require('debug')('myphotos:album_controller'); 
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
 
/**
* * Hämta alla album till den inloggade användaren 
*
* GET /albums
*/
const getAlbums = async (req, res) => {
	const user = await models.user_model.fetchById(req.user_model.user_id, {
		withRelated: ['albums'] });
 
	res.status(200).send({
		 status: 'success',
		 data: user.related('albums')
	 });
 };
 
/**
* Hämta ett specifikt album 
* GET /albums/:albumId
*/
const showAlbum = async (req, res) => {
	// Hämta användaren
	const user = await models.user_model.fetchById(req.user_model.user_id, { withRelated: ['albums'] });

	// Hämta användarens alla album
	const allAlbums = user.related('albums');

	// Plocka ut ett specifikt album genom att skriva ex. /1 i sökvägen för att få ut album med id 1.
	const albumWithSpecificId = allAlbums.find(album => album.id == req.params.albumId);

	if (!albumWithSpecificId) {
		return res.status(404).send({
			status: 'error',
			message: 'Album with that ID was not found',
		});
	}
	
	const photosInThisAlbum = await models.album_model.fetchById(req.params.albumId, { withRelated: ['photos'] });

	const userPhoto = user.related('photos').find(photo => photo.id == validData.photo_id);
 
	res.send({
		status: 'success',
		data: { 
			id: albumWithSpecificId.get('id'),
			title: albumWithSpecificId.get('title'),
			photosInThisAlbum,
			
		}
	});
};
 
/**
* * Lägg till ett nytt album
*
* * POST /albums
*/
const addAlbum = async (req, res) => {
	// Hämta användaren
	const user = await models.user_model.fetchById(req.user_model.user_id, { withRelated: ['albums'] });

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}
	const validData = matchedData(req);

	validData.user_id = req.user_model.user_id;
 
	try {
		const album = await new models.album_model(validData).save();
		debug("Created new album successfully: %O", album);

		res.send({
			status: 'success',
			data: {
				title: album.get('title'),
				user_id: user.id,
				id: album.get('id'),
			}
		});
 
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new Album.',
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

/**
* * Lägg till ett foto i ett album
*
* * POST /albums/:albumId/photos
*/

const addPhotoToAlbum = async (req, res) => {
	// kolla efter validerings error
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// Spara bara det jag efterfrågat i validData
	const validData = matchedData(req);
	
	// Hämta relationen till användarens album
	const user = await models.user_model.fetchById(req.user_model.user_id, { withRelated: ['albums'] });

	// Hämta ut relationen mellan albumet och fotona
	const album = await models.album_model.fetchById(req.params.albumId, { withRelated: ['photos'] });

	// * ersätta denna med raden ovanför??????
	// const album = user.related('album');

	// Hämta ut det efterfrågade albumet (kommer från params)
	const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);

	// Hämta endast foton som tillhör den inloggade användaren 
	const userPhoto = user.related('photos').find(photo => photo.id == validData.photo_id);

	// Kolla ifall fotot redan finns i albumet (DETTA FUNKAR INTE!!!!)
	const existing_photo = album.related('photos').find(photo => photo.id == validData.photo_id);

	// Finns fotot redan; bail
	if (existing_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

	// Om det inte är användarens album eller foto; bail
	if (!userAlbum || !userPhoto) {
		return res.send({
			status: 'fail',
			data: 'Album or Photo does not belong to user',
		});
	}

	try {
		const result = await userAlbum.photos().attach(validData.photo_id);
		debug("Added photo to Album successfully: %O", result, result.length);

		/*
		album.photos().attach(validData.photo_id);
		*/

		res.send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to an album.',
		});
		throw error;	
}};

module.exports = {
	getAlbums,
	showAlbum,
	addAlbum,
	updateAlbum,
	addPhotoToAlbum,
}

 