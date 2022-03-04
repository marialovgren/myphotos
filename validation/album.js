/* Album validation rules
*/

const { body } = require('express-validator');

/**
 * Regler för att lägga till ett nytt album
 * POST /albums
 * 
 * Required: title, 
 */
const createRules = [
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
    createRules,
    updateRules
};
