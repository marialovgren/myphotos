/**
 * User Controller
 */

 const bcrypt = require('bcrypt');
 const debug = require('debug')('books:profile_controller');
 const { matchedData, validationResult} = require('express-validator');
 const { User } = require('../models');
 
/** 
* Hämta den inloggade användarens album och foton
*
* GET /user
*/
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

/**
* Add an album to the authenticated user
*
* POST /albums
*/
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
 /**
  * Add an album to the authenticated user
  */
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
    getAlbums,
    addAlbum,
    updateAlbum,
 }