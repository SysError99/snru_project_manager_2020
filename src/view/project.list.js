const _ = require('../const')
const ProjectManager = require('../project.manager')
const Template = require('./template')
const User = require('../user')
/**
 * Construct project list viewer UI
 * @param {User} user User object
 * @returns {string} Constructed project list viewer UI
 */
const view = function(user){
    let result = ``
    /** @type {string[]} List of keywords to be used */
    let keywords = [user.name]
    switch(user.type){
        case 'committee':
            user.category.forEach(function(c){
                keywords.push(c)
            })
            break
    }
    let projList = ProjectManager.fetch(keywords)
    if(projList.length > 0){
        let resultList = []
        //result += /*html*/`${}`
        projList.forEach(function(proj){
            resultList.push(proj[0] + '::ID: ' + proj[4] + '::Owner: ' + proj[1] + '::Category: ' + proj[2] + '::Advisors: ' + proj[3]
            + /*html*/`<br>` + Template.link('/projview?id=' + proj[4],'View project'))
        })
        result += Template.content(resultList)
    }else
        result += Template.content([_.MSG.PROJ.TITLE + '::No projects'])
    return result
}
module.exports = view