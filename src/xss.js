let lt = /</g, 
    gt = />/g, 
    ap = /'/g, 
    ic = /"/g
/**
 * Prevent XSS injection by improving string.
 * @param {string} str String to be inproved
 * @returns {string} Improved string
 */
module.exports = function(str){
    if(typeof str === 'string')
        return str.replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;")
    else
        return ''
}