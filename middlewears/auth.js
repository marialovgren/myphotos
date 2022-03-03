/** Här finns basic authentication middlewear och JWT */

const debug = require('debug')('books:auth');
const { User } = require('../models') 
const jwt = require('jsonwebtoken');

/** 
 * HTTP Basic authentication middlewear
 */
 const basic = async (req, res, next) => {
    // make sure Authorization header exists, otherwise bail
    if (!req.headers.authorization) {
        debug("Authorization header missing");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization required',
        });
    }

    debug("Authorization header: %o", req.headers.authorization); // %o är en placeholder för den efterföljande parametern som jag skickar med. 

    // spilt header into "<authSchema> <base64Payload>"
    // [0] = "Basic"
    // [1] = "koden som omvandlat användarnamn och lösenord"
    const [authSchema, base64Payload] = req.headers.authorization.split(' ');

    // if authSchema is not Basic then bail
    if (authSchema.toLowerCase() !== "basic") {
        debug("Authorization isn´t basic");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization required',
        });
    }

    // decode payload from base64 to ascii. Först sparas innehållet från base64Payload i en Buffer, och sedan gör jag om detta till en sträng och talar om att det ska skrivas i ascii. 
    const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii'); // decodedPayload = "username:password"

    // split decoded payload into "<username>:<password>"
    const [email, password] = decodedPayload.split(':'); // här splittas det som finns i decodedPayload och delas av med :

    const user = await User.login(email, password);
    if (!user) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    };

    // finally, attach user to request
    req.user = user;

    // pass request along
    next();
};

/**
 * Validate JWT token
 */
const validateJwtToken = (req, res, next) => {
    // make sure Authorization header exists, otherwise bail
    if (!req.headers.authorization) {
        debug("Authorization header missing");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }

    // Authorization: "Bearer jjbjkbjk9879.kjbjguyjgiukhlkdfnhkdjf.8y2e3928ey72iuehk". Bearer är authSchema resten är token
    // split authorization header into "authSchema token"
    const [authSchema, token] = req.headers.authorization.split(' ');
    if (authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }

    // verify token (and extract payload)
    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    } catch {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }

    // pass request along 
    next();
}

module.exports = {
    basic,
    validateJwtToken
};

