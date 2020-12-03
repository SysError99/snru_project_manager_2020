/**
 * Comment object
 * @param {object} data JSON data to import comment
 */
const CommentObject = function(data){
    let C = this
    this.isCommentObject = true
    /** @type {string} Comment author */
    this.name = (typeof name === 'string') ? name : ''
    /** @type {string} Comment text */
    this.text = (typeof text === 'string') ? text : ''
    /** @type {string} Comment type */
    this.type = (typeof type === 'string') ? type : ''
    /**
     * Import JSON data.
     * @param {object} d JSON data
     */
    this.import = function(d){
        if(typeof d !== 'object')
            return
        if(typeof d.name === 'string') C.name = d.name
        if(typeof d.text === 'string') C.text = d.text
        if(typeof d.type === 'string') C.type = d.type
    }
    /**
     * Export this comment to JSON
     * @returns exported comment
     */
    this.export = function(){
        return {
            name: C.name,
            text: C.text,
            type: C.type
        }
    }
    if(typeof data === 'object')
        this.import(data)
}
module.exports = CommentObject