const Project = require('../project')
const User = require('../user')
const Template = require('./template')
/**
 * Generate document upload form.
 * @param {string} type Submit type
 * @param {User} usr User object
 * @param {Project} proj Project object
 * @returns {string} HTML element.
 */
const doc = function(type,usr,proj){
	let render = ''
	switch(usr.type){
		case 'student':
            let approvedTxt = ``
            /** @type {string[]} List of approved committees */
            let approveList = proj[type + 'Approve']
            if(Array.isArray(approveList)){
                if(approveList.length > 0)
                    approveList.forEach(function(a,i){
                        if(approveList.length === 1)
                            approvedTxt += a
                        else if(i === approveList.length - 1)
                            approvedTxt += 'and ' + a
                        else
                            approvedTxt += a + ', '
                    })
                else
                    approvedTxt = `None`
            }else
                approvedTxt = 'undefined'
			render += /*html*/`
<form action="projsubmit/${type}/${proj.id}" method="post" enctype="multipart/form-data">
	<label for="name">Choose your document:</label>
	<input type="file" id="file" name="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
	<input type="submit" value="Submit">
</form><br>
${(approvedTxt !== 'undefined')?`Approved by: ${approvedTxt}`:''}`
			break
		case 'committee':
			/** @type {string[]} Approved committees */
			let projApprove = proj[type + 'Approve']
			let projApprovePosition = -1
			if(Array.isArray(projApprove))
				projApprovePosition = projApprove.findIndex(ele => ele === usr.name)
			if(projApprovePosition > -1)
				render += /*html*/`<br>` + Template.link(`projdisapprove/${type}/${proj.id}`,'Dispprove')
			else
				render += /*html*/`<br>` + Template.link(`projapprove/${type}/${proj.id}`,'Approve')
			break
	}
	return /*html*/`
	${(
		function(){
			if(typeof proj[type] !== 'string')
				return ''
			if(proj[type] !== '')
				return /*html*/`<br>` + 'File: ' + proj[type] + ' ' + Template.link('file/' + proj[type], 'Download')
			else
				return ''
		}
    )()}<br>
    ${render}`
}
/**
 * Construct Project UI.
 * @param {User} usr User object
 * @param {Project} project Project object
 * @returns {string} Built HTML string
 */
const view = function(usr,project)
{
    let elements = [
        'Edit project::' +
 /*html*/`<form action="projedit/${project.id}" method="post">
    <label for="name">Project name:</label> <input type="text" id="name" name="name" value="${project.name}"><br><br>
    <label for="owner">Project authors:</label> <input type="text" id="owner" name="owner" value="${project.owner.join(',')}"><br><br>
    <label for="category">Project category:</label> <input type="text" id="category" name="category" value="${project.category.join(',')}"><br><br>
    <label for="teacher">Project advisors:</label> <input type="text" id="teacher" name="teacher" value="${project.teacher.join(',')}"><br><br>
    <input type="submit" value="Submit changes">
</form>`,
        'Draft stage::First submission should go here.' + doc('draft',usr,project),
        'Progress stage::You should submit all changes on this section.' + doc('progress',usr,project),
        'Final stage::You should only upload final document here.' + doc('final',usr,project),
        'Full text document::' + doc('doc',usr,project),
        'Journal::' + doc('journal',usr,project),
        'Comments::' + /*html*/`${(
            function(){
                let str = ``
                project.comment.forEach(function(comment){
                    let commentColor = 'black'
                    switch(comment.type){
                        case 'committee':
                            commentColor = 'red'
                            break
                        case 'teacher':
                            commentColor = 'blue'
                            break
                    }
                    str += /*html*/`<span style="color:${commentColor}">(${comment.type})</span> ${comment.name} : ${comment.text}<br><br>`
                })
                return str
            }
        )()}<br>
        <form action="projcomment/${project.id}" id="comment" method="post">
            Leave a comment<br><br>
            <textarea name="text" form="comment" style="width:60%;height:200;"></textarea><br><br>
            <input type="submit" value="Submit">
        </form>`,
    ]
    if(usr.type !== 'student')
        elements.splice(0,1)
    return Template.content(elements)
}
module.exports = view