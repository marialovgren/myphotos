/**
* Album Controller
*/

const debug = require('debug')('books:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
const User = require('../models/User');
 
/**
* Hämta alla album till den inloggade användaren 
*
* GET /albums
*/
const getAlbums = async (req, res) => {
	const user = await User.fetchById(req.user.user_id, {
		withRelated: ['albums'] });
 
	res.status(200).send({
		 status: 'success',
		 data: {
			 albums: user.related('albums'),
		 }
	 });
 };
 
/**
* Hämta ett specifikt album 
* GET /albums/:albumId
*/
const showAlbum = async (req, res) => {
	const user = await User.fetchById(req.user.user_id, { withRelated: ['albums'] });

	// Hämta användarens alla album
	const allAlbums = user.related('albums');

	// Plocka ut ett specifikt album genom att skriva ex. /1 i sökvägen för att få ut album med id 1.
	const albumWithSpecificId = albums.find(album => album.id == validData.album_id);

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
			album: albumWithSpecificId,
		},
	 });
 };
 
 /**
  * Lägg till ett nytt album
  *
  * POST /albums
  */
 const store = async (req, res) => {
	 // check for any validation errors
	 const errors = validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(422).send({ status: 'fail', data: errors.array() });
	 }
 
	 // get only the validated data from the request
	 const validData = matchedData(req);
 
	 try {
		 const album = await new models.Album(validData).save();
		 debug("Created new album successfully: %O", album);
 
		 res.send({
			 status: 'success',
			 data: {
				 album,
			 },
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
  * Update a specific resource
  *
  * PUT /albums/:albumId
  */
 const update = async (req, res) => {
	 const albumId = req.params.albumId;
 
	 // make sure book exists
	 const album = await new models.Album({ id: albumId }).fetch({ require: false });
	 if (!album) {
		 debug("Album to update was not found. %o", { id: albumId });
		 res.status(404).send({
			 status: 'fail',
			 data: 'Album Not Found',
		 });
		 return;
	 }
 
	 // check for any validation errors
	 const errors = validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(422).send({ status: 'fail', data: errors.array() });
	 }
 
	 // get only the validated data from the request
	 const validData = matchedData(req);
 
	 try {
		 const updatedAlbum = await album.save(validData);
		 debug("Updated album successfully: %O", updatedAlbum);
 
		 res.send({
			 status: 'success',
			 data: {
				 album,
			 },
		 });
 
	 } catch (error) {
		 res.status(500).send({
			 status: 'error',
			 message: 'Exception thrown in database when updating a new album.',
		 });
		 throw error;
	 }
 }
 
 module.exports = {
	 getAlbums,
 }