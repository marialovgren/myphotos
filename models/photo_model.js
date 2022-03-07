/**
 * Photo model
 */

 module.exports = (bookshelf) => {
    return bookshelf.model('Photo', {
        tableName: 'photos',
        users() {
            return this.belongsTo('User');
        }, 
        tableName: 'photos',
        albums() {
            return this.hasMany('Album');
        }
    });
};