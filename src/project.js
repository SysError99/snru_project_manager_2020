const CommentObject = require("./comment")
const Hash = require('./hash')
/**
 * Project object
 * @param {object} data JSON data to be imported in.
 */
const Project = function(data){
    let P = this
    this.isProject = true
    /** @type {string} Project ID */
    this.id = Hash.randHex(32)
    /** @type {string} Project name */
    this.name = ''
    /** @type {string[]} Project owners */
    this.owner = []
    /** @type {string[]} Project teacher */
    this.teacher = []
    /** @type {string[]} Project category */
    this.category = []
    /** @type {string} Draft document location */
    this.draft = ''
    /** @type {string[]} Draft stage approval members */
    this.draftApprove = []
    /** @type {string} Full text document location*/
    this.doc = ''
    /** @type {string[]} Full stage approval members*/
    this.docApprove = []
    /** @type {string} Final stage document */
    this.final = ''
    /** @type {string[]} Final stage approval members*/
    this.finalApprove = []
    /** @type {string} Journal document location */
    this.journal = ''
    /** @type {string[]} Journal stage approval members */
    this.journalApprove = []
    /** @type {string} Document by progress*/
    this.progress = ''
    /** @type {CommentObject[]} Project comments */
    this.comment = []
    /**
     * Import project JSON data
     * @param {object} data JSON object
     */
    this.import = function(d){
        if(typeof d !== 'object'){
            console.error('Can\'t import project!: parameter is not JSON object, did you have converted it yet?')
            return
        }
        if(typeof d.id === 'string') P.id = d.id
        if(typeof d.name === 'string') P.name = d.name
        if(Array.isArray(d.owner)) P.owner = d.owner
        if(Array.isArray(d.teacher)) P.teacher = d.teacher
        if(Array.isArray(d.category)) P.category = d.category
        if(typeof d.draft === 'string') P.draft = d.draft
        if(Array.isArray(d.draftApprove)) P.draftApprove = d.draftApprove
        if(typeof d.doc === 'string') P.doc = d.doc
        if(Array.isArray(d.docApprove)) P.docApprove = d.docApprove
        if(typeof d.final === 'string') P.final = d.final
        if(Array.isArray(d.finalApprove)) P.finalApprove = d.finalApprove
        if(typeof d.journal === 'string') P.journal = d.journal
        if(Array.isArray(d.journalApprove)) P.journalApprove = d.journalApprove
        if(Array.isArray(d.progress)) P.progress = d.progress
        if(Array.isArray(d.comment))
            d.comment.forEach(function(comment){
                if(typeof comment === 'object')
                    P.comment.push(new CommentObject(comment))
            })
    }
    /**
     * Export this project to JSON
     * @returns JSON object (not string)
     */
    this.export = function(){
        let commentArr = []
        P.comment.forEach(function(comment){
            commentArr.push(comment.export())
        })
        return {
            id: P.id,
            name: P.name,
            owner: P.owner,
            teacher: P.teacher,
            category: P.category,
            draft: P.draft,
            draftApprove: P.draftApprove,
            doc: P.doc,
            docApprove: P.docApprove,
            final: P.final,
            finalApprove: P.finalApprove,
            journal: P.journal,
            journalApprove: P.journalApprove,
            progress: P.progress,
            comment: commentArr
        }
    }
    if(typeof data === 'object')
        this.import(data)
}
module.exports = Project