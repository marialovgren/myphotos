/**
* User model
*/
const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
	return bookshelf.model('user_model', {
		tableName: 'users',
		albums() {
			return this.hasMany('album_model');
		}, 
		tableName: 'users',
		photos() {
			return this.hasMany('photo_model');
		}
	}, {
		hashSaltRounds: 10,
 
		async login(email, password) {
			const user = await new this({ email }).fetch({ require: false });
			// om användaren inte finns, så faila
			if (!user) {
				return false; 
			}
 
			const hash = user.get('password');
 
			// första parametern i bcrypt.compare ska vara lösenordet i klartext och den andra parametern ska vara lösenordet när det är saltat. 
			const result = await bcrypt.compare(password, hash)
			if (!result) {
				return false;
			}
			return user; 
		},
 
		// fetchOptions sätts till ett tomt objekt som default så att man inte måste skicka in en andra parameter utan det räcker att skicka in id
		async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		} 
	});
};
 