/* Album validation rules
*/

const { body } = require('express-validator');
const models = require('../models');

/**
 * Regler för att lägga till ett nytt album
 * POST /albums
 * 
 * Required: title, album_id
 */
const addAlbumRules = [
    body('title').exists().isLength({ min:3 }),
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
    addAlbumRules,
    updateRules
};


/* 
body('album_id').exists().bail().custom(async value => {
        const album = await new models.Album({ id: value }).fetch({ require: false });
        if (!album) {
            return Promise.reject(`Album with ID ${value} does not exist.`);
        }

        return Promise.resolve();
    }),
*/