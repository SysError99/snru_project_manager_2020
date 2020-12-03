const Project = require('../project')
const Template = require('./template')
/**
 * Construct Project UI.
 * @param {Project} project Project object
 * @returns {string} Built HTML string
 */
const view = function(project)
{
    return Template.content([
        'Draft stage submission::First submission should go here.' + Template.form.doc('draft'),
        'Progress stage submission::You should submit all changes on this section.' + Template.form.doc('progress'),
        'Final stage submission::You should only upload final document here.' + Template.form.doc('final'),
        'Full text document submission::' + Template.form.doc('doc'),
        'Journal submission::' + Template.form.doc('journal'),
        'Comments::' + /*html*/`${(
            function(){
                let str = ``
                project.comment.forEach(function(comment){
                    str += /*html*/`${comment.name} (${comment.type}): ${comment.text}<br>`
                })
                return str
            }
        )()}<br>
        <form action="projcomment" id="comment" method="post">
            Leave a comment <input type="submit" value="Submit">
        </form>
        <textarea name="text" form="comment"></textarea>`,
    ])
}
module.exports = view