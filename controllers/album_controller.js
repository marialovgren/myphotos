/**
 * Album Controller
 */

 const debug = require('debug')('books:album_controller');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');
 
 /**
  * Hämta alla album
  *
  * GET /albums
  */
 const index = async (req, res) => {
	 const all_albums = await models.Album.fetchAll();
 
	 res.send({
		 status: 'success',
		 data: {
			 album: all_albums
		 }
	 });
 }
 
 /**
  * Hämta ett album 
  * GET /:albumId
  */
 const show = async (req, res) => {
	 const album = await new models.Album({ id: req.params.albumId })
		 .fetch({ withRelated: ['users'] });
 
	 res.send({
		 status: 'success',
		 data: {
			 album,
		 }
	 });
 }
 
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
	 index,
	 show,
	 store,
	 update,
 }