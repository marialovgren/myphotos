/**
* Auth Controller
*/
const bcrypt = require('bcrypt');
const debug = require('debug')('myphotos:auth_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
const jwt = require('jsonwebtoken');
 
/**
 * * Login a user, sign a JWT token and return it
 * 
 * * POST /login
 *  {
 *   "email": "",
 *   "password": ""
 * 	}
 */
 const login = async (req, res) => {
	// plocka ut 'email' och 'password' från req.body
	const { email, password } = req.body;

	// logga in användaren 
	const user = await models.user_model.login(email, password);
	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authentication failed.',
		});
	}

	// jwt payload
	const payload = {
		sub: user.get('email'),
		user_id: user.get('id'),
		name: user.get('first_name') + ' ' + user.get('last_name'),
	}

	// signera jwt och få fram access-token
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

	// svara me access-token
	return res.send({
		status: 'success',
		data: {
			access_token,
		}
	});
}

/**
* * Register a new user
*
* * POST /register
*/
const register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// spara bara den validerade datan i 'validData'
	const validData = matchedData(req);

	console.log("The validated data:", validData);

	// hasha lösenordet och spara det nya hashade lösenorder i 'validData.password'
    try {
        validData.password = await bcrypt.hash(validData.password, models.user_model.hashSaltRounds);

    } catch (error) {
        res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing password.',
        });
        throw error;
    }

	try {
		const user = await new models.user_model(validData).save();
		debug("Created new user successfully: %O", user);
		res.send({
			status: 'success',
			data: {
				user,
			},
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.',
		});
        throw error;
	}
}

module.exports = {
	register,
	login
}


