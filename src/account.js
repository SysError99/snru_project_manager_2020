/** Account object */
const UserAccount = function(data){
    let A = this
    this.isAccount = true
    /** @type {boolean} Account approve state */
    this.approved = false
    /** @type {string} Account username */
    this.username = ''
    /** @type {string} Account password */
    this.password = ''
    /** @type {string} Account type */
    this.type = 'student'
    /** @type {string} Account legal name*/
    this.name = ''
    /** @type {string[]} Account category */
    this.category = []
    /** @type {string} Student ID */
    this.studentId = ''
    /**
     * Import data from JSON
     * @param {object} d JSON object
     */
    this.import = function(d){
        if(typeof d !== 'object')
            return
        if(typeof d.approved === 'boolean') A.approved = d.approved
        if(typeof d.username === 'string') A.username = d.username
        if(typeof d.password === 'string') A.password = d.password
        if(typeof d.type === 'string') A.type = d.type
        if(typeof d.name === 'string') A.name = d.name
        if(Array.isArray(d.category)) A.category = d.category
        if(typeof d.studentId === 'string') A.studentId = d.studentId
    }
    /**
     * Export to JSON
     * @returns JSON object
     */
    this.export = function(){
        return {
            approved: A.approved,
            username: A.username,
            password: A.password,
            type: A.type,
            name: A.name,
            category: A.category,
            studentId: A.studentId
        }
    }
    if(typeof data === 'object')
        this.import(data)
}
module.exports = UserAccount