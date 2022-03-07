/** Här finns JWT */

const debug = require('debug')('myphotos:auth');
const { user_model } = require('../models') 
const jwt = require('jsonwebtoken');

/**
 * * Validera JWT token
 */
const validateJwtToken = (req, res, next) => {
    // Om det inte finns någon 'Authorization header' så faila med statuskod 401
    if (!req.headers.authorization) {
        debug("Authorization header missing");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }

    // dela upp datan i 'authorization header' 
    const [authSchema, token] = req.headers.authorization.split(' ');
    if (authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }

    // verifiera token och spara i user_model
    try {
        req.user_model = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    } catch {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }
 
    next();
}

module.exports = {
    validateJwtToken,
};

