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
			status: 'fail',
			message: 'Album with that ID was not found',
		});
	}

	// Här ska jag skriva kod för att kunna visa foton som tillhör albumet med det efterfrågade ID
 
	res.send({
		status: 'success',
		data: {
			id: albumWithSpecificId.id,
			title: albumWithSpecificId.get('title'),
			// här ska fotona i detta albumet visas
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

module.exports = {
	getAlbums,
	showAlbum,
	addAlbum,
	updateAlbum,
}

 /* FRÅN PROFILE_CONTROLLER

  const bcrypt = require('bcrypt');
  const debug = require('debug')('books:profile_controller');
  const { matchedData, validationResult} = require('express-validator');
  const { User } = require('../models');
  

 //Hämta den inloggade användarens album och foton
 
 //GET /user
 
 const getProfile = async (req, res) => {
  
	 const user = await User.fetchById(req.user.user_id, { withRelated: ['albums', 'photos'] });
  
	 res.status(200).send({
		 status: 'success',
		 data: {
			 albums: user.related('albums'),
			 photos: user.related('photos')
		 }
	 });
 }
 

 const addAlbum = async (req, res) => {
	 const user = await User.fetchById(req.user.user_id);
  
	 // check for any validation errors
	 const errors = validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(422).send({ status: 'fail', data: errors.array() });
	 }
  
	 // get only the validated data from the request
	 const validData = matchedData(req);
  
	 // lazy-load book relationship
	 await user.load('albums');
  
	 // get the user's albums
	 const albums = user.related('albums');
  
	 // check if album is already in the user's list of albums
	 const existing_album = albums.find(album => album.id == validData.album_id);
  
	 // if it already exists, bail
	 if (existing_album) {
		 return res.send({
			 status: 'fail',
			 data: 'Album already exists.',
		 });
	 }
  
	 try {
		 const result = await user.albums().attach(validData.album_id);
		 debug("Added album to user successfully: %O", result);
  
		 res.send({
			 status: 'success',
			 data: null,
		 });
  
	 } catch (error) {
		 res.status(500).send({
			 status: 'error',
			 message: 'Exception thrown in database when adding an album to a user.',
		 });
		 throw error;
 }}

   //Add an album to the authenticated user
   
   const add = async (req, res) => {
	  const user = await User.fetchById(req.user.user_id);
  
	  // check for any validation errors
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		  return res.status(422).send({ status: 'fail', data: errors.array() });
	  }
  
	  // get only the validated data from the request
	  const validData = matchedData(req);
  
	  // lazy-load book relationship
	  await user.load('books');
  
	  // get the user's books
	  const books = user.related('books');
  
	  // check if book is already in the user's list of books
	  const existing_book = books.find(book => book.id == validData.book_id);
  
	  // if it already exists, bail
	  if (existing_book) {
		  return res.send({
			  status: 'fail',
			  data: 'Book already exists.',
		  });
	  }
  
	  try {
		  const result = await user.books().attach(validData.book_id);
		  debug("Added book to user successfully: %O", result);
  
		  res.send({
			  status: 'success',
			  data: null,
		  });
  
	  } catch (error) {
		  res.status(500).send({
			  status: 'error',
			  message: 'Exception thrown in database when adding a book to a user.',
		  });
		  throw error;
	  
  }}
  
  module.exports = {
	 getProfile,
	 getAlbums,
	 addAlbum,
	 updateAlbum,
  }
  */