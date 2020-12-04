const Hash = require('./hash')
/**
 * A logged in user class.
 * @param {string} usr Username
 * @param {string} type User type
 * @param {string} name User legal name
 * @param {string[]} category User category
 */
const User = function(usr, type, name, category){
    this.isUser = true
    /**  @type {string} Username of this user */
    this.username = (typeof usr === 'string') ? usr : ''
    /** @type {string} Authentication token */
    this.token = Hash.randHex(256)
    /** @type {string} User type */
    this.type = (typeof type === 'string') ? type : 'student'
    /** @type {number} User session age */
    this.age = 2592000
    /** @type {string} Legal name*/
    this.name = (typeof name === 'string') ? name : ''
    /** @type {string[]} User category */
    this.category = (Array.isArray(category)) ? category : []
}
module.exports = User