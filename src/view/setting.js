const UserAccount = require('../account')
const Template = require('./template')
/**
 * Build account
 * @param {UserAccount} acc Account object
 * @returns {string} HTML rendered string
 */
const view = function(acc){
    let components = [
'Category::' + /*html*/
`<form action="changecategory" method="post">
<label for="category">Change account category:</label><br>
<input type="text" name="category" value="${acc.category.join(',')}"><br><br>
<input type="submit" value="Change">
</form>`,
'Password::' + /*html*/
`<form name="password" onsubmit="return validatePassword()" action="changepassword" method="post">
    <label for="oldpassword">Old password:</label><br>
    <input type="password" name="oldpassword" value=""><br>
    <label for="password0">New password:</label><br>
    <input type="password" name="password0" value=""><br>
    <label for="password1">Confirm password:</label><br>
    <input type="password" name="password1" value=""><br><br>
    <input type="submit" value="Change">
</form>
<script>
const validatePassword = function(){
    let password0 = document.forms['password']['password0'].value
    let password1 = document.forms['password']['password1'].value
    if(password0 !== password1){
        alert('Password not match!')
        return false
    }
}
</script>`
]
    if(acc.type === 'student')
        components.push('Student ID::' + /*html*/
`<form action="changestdid" method="post">
<label for="stdId">Change Student ID:</label><br>
<input type="text" name="stdid" value="${acc.studentId}"><br><br>
<input type="submit" value="Change">
</form>`)
    return Template.content(components)
}
module.exports = view