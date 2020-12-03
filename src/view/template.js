const Project = require('../project')
const User = require('../user')
/** @type {number} Current year */
let currentYear = 0
/**
 * Update year
 */
const yearUpdate = function(){
    currentYear = new Date().getUTCFullYear()
}
setInterval(yearUpdate,86400000)
yearUpdate()
/**
 * Convert array to content.
 * @param {string[]} arr String array.
 */
const content = function(arr){
	let txt = ''
	arr.forEach(function(a,i){
		if(a !== ''){
			let ae = a.split('::')
			txt += /*html*/
`<div class="w3-row ${(i % 2 === 0)?'w3-padding-64':''}">
	<div class="w3-twothird w3-container">
		<h2 class="w3-text-teal">${ae[0]}</h2>
		${(function(){
			let pp = ``
			if(ae.length > 1)
				for(let i=1; i < ae.length; i++){
					pp += /*html*/`<p>${ae[i]}</p>`
				}
			return pp
		})()}
	</div>
</div>`
	}
	})
	return txt
}
/**
 * Build page from template.
 * @param {User} user User object
 * @param {string} title Title
 * @param {string} innerHTML HTML string to be displayed inside body
 * @returns {string} Built HTML string
 */
const build = function(user, title, innerHTML)
{
    let additionalSidebar = /*html*/``
    switch(user.type){
        case `student`:
            additionalSidebar = /*html*/`<a class="w3-bar-item w3-button w3-hover-black" href="projnew">New project</a>`
            break
    }
	return /*html*/`<!DOCTYPE html>
<html lang="en">
<title>SNRU CS Project Manager</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="css/lib/w3-theme-black.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
html,body,h1,h2,h3,h4,h5,h6 {font-family: "Roboto", sans-serif;}
.w3-sidebar {
	z-index: 3;
	width: 250px;
	top: 43px;
	bottom: 0;
	height: inherit;
}
</style>
<body>
<div class="w3-top">
	<div class="w3-bar w3-theme w3-top w3-left-align w3-large">
	<a class="w3-bar-item w3-button w3-right w3-hide-large w3-hover-white w3-large w3-theme-l1" href="javascript:void(0)" onclick="w3_open()"><i class="fa fa-bars"></i></a>
	<a href="/" class="w3-bar-item w3-button w3-theme-l1">SNRU CS Project Manager</a>
	<a href="#" class="w3-bar-item w3-button w3-hide-small w3-hover-white">${title}</a>
	</div>
</div>
<nav class="w3-sidebar w3-bar-block w3-collapse w3-large w3-theme-l5 w3-animate-left" id="mySidebar">
	<a href="javascript:void(0)" onclick="w3_close()" class="w3-right w3-xlarge w3-padding-large w3-hover-black w3-hide-large" title="Close Menu">
		<i class="fa fa-remove"></i>
	</a>
	<h4 class="w3-bar-item"><b>Hello, ${user.name}!</b></h4>
	<a class="w3-bar-item w3-button w3-hover-black" href="/">Projects</a>
	${additionalSidebar}
	<a class="w3-bar-item w3-button w3-hover-black" href="setting">Settings</a>
	<a class="w3-bar-item w3-button w3-hover-black" href="logout">Sign out</a>
</nav>
<div class="w3-overlay w3-hide-large" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>
<div class="w3-main" style="margin-left:250px">
	${innerHTML}
	<footer id="myFooter">
	<div class="w3-container w3-theme-l2 w3-padding-32">
		<h4>Copyright ${currentYear} SysError99 & Sakon Nakhon Rajabhat University</h4>
	</div>
	<div class="w3-container w3-theme-l1">
		<p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p>
	</div>
	</footer>
</div>
<script>
var mySidebar = document.getElementById("mySidebar")
var overlayBg = document.getElementById("myOverlay")
function w3_open() {
	if(mySidebar.style.display === 'block') {
	mySidebar.style.display = 'none'
	overlayBg.style.display = "none"
	}else{
	mySidebar.style.display = 'block'
	overlayBg.style.display = "block"
	}
}
function w3_close() {
	mySidebar.style.display = "none"
	overlayBg.style.display = "none"
}
</script>
</body>
</html>`
}
/**
 * Create a button link
 * @param {string} url URL to go
 * @param {string} txt Text to be put in
 * @returns {string} HTML link button
 */
const link = function(url,txt){
	return /*html*/`<a class="w3-button w3-black" href="${url}">${txt}</a>`
}
/**
 * Build side menu item
 * @param {string} url Target URL
 * @param {string} txt Text
 * @returns {string} HTML menu
 */
const sideMenu = function(url, txt){
	return /*html*/`<a class="w3-bar-item w3-button w3-hover-black" href="${url}">${txt}</a>`
}
/**
 * Create HTML title
 * @param {string} title Title text
 * @param {string} titlecontent Title text
 * @returns {string} HTML rendered string.
 */
const title = function(txt,titlecontent){
	return '' + /*html*/`<div class="w3-row w3-padding-64"><div class="w3-twothird w3-container"><h2 class="w3-text-teal">${txt}</h2><br>${(typeof titlecontent === 'string')?titlecontent:''}</div></div>`
}
/** Template Builder */
module.exports = {
	build: build,
	content: content,
	link: link,
	sideMenu: sideMenu,
	title: title
}