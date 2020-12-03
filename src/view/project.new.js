/** New project UI */
module.exports = /*html*/`(split each elements with ',')
<form action="projnew" method="post">
    <label for="name">Project name:</label><br>
    <input type="text" id="name" name="name" value=""><br>

    <label for="category">Project category:</label><br>
    <input type="text" id="category" name="category" value=""><br><br>

    <label for="teacher">Project advisor:</label><br>
    <input type="text" id="teacher" name="teacher" value=""><br><br>

    <input type="submit" value="Create">
</form>`