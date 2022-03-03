/**
 * Album Controller
 */

 const bcrypt = require('bcrypt');
 const debug = require('debug')('books:album_controller');
 const { matchedData, validationResult} = require('express-validator');
 const { User } = require('../models');
 
/** 
* Hämta den inloggade användarens album
*
* GET /albums
*/
const getAlbums = async (req, res) => {
 
    const user = await User.fetchById(req.user.user_id, { withRelated: ['albums'] });
 
    res.status(200).send({
        status: 'success',
        data: {
            albums: user.related('albums'),
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
* Uppdatera den inloggade användarens album
*
* PUT /albums/:albumId
*/
const updateAlbum = async (req, res) => {
    // kolla efter fel 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         return res.status(422).send({ status: 'fail', data: errors.array() });
    }
 
    const validData = matchedData(req); // endast den data jag efterfrågat sparas i databasen.
     
    // update the users album but only if they have sent us a new title
    if (validData.title) {
        try {
            validData.title = await bcrypt(validData.title);
        } catch (error) {
            res.status(500).send({
                status: 'error',
                message: 'Exception thrown in database when updating an album.',
            });
            throw error;
    } 
 
    try {
        const album = await Album.fetchById(req.user.user_id);
 
        const updatedAlbum = await album.save(validData);
        debug("Updated album successfully: %O", updatedAlbum);
 
        res.send({
            status: 'success',
            data: {
                album: updatedAlbum,
            },
        });
 
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating an album.',
        });
        throw error;
    }
}}

 module.exports = {
    getAlbums,
    addAlbum,
    updateAlbum,
}