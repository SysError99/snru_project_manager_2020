const _ = require('../const')
const UserAccount = require('../account')
const AccountSettings = require('./setting')
const Mdb = require('../mdb')
const ProjectManager = require('../project.manager')
const ProjectListViewer = require('./project.list')
const ProjectCreator = require('./project.new')
const ProjectViewer = require('./project.view')
const User = require('../user')
/**
 * Build page template
 * @param {string} type User type
 * @param {string} hilight Sidebar hilighting
 * @param {string} innerHTML InnerHTML to be put in
 * @returns {string} Built HTML template
 */
const Template = require('./template')
/**
 * Construct alert HTML
 * @param {string} message Message to be alerted
 * @param {string} redirect Next destination
 * @returns {string} HTML alert dialog
 */
const alert = function(message,redirect){
    return /*html*/`<script>${ (message !== '') ? 'alert(\''+message+'\');' : '' }window.location='/${(typeof redirect === 'string')?redirect:''}';</script>`
}
/** View class */
const View = function(){
    this.isView = true
    this.alert = alert
    /**
     * Home page
     * @param {User} user User object
     * @returns {string} Built HTML string
     */
    this.home = function(user){
        return Template.build(user, 'Projects', ProjectListViewer(user))
    }
    this.login = require('./login')
    /** All views related to projects */
    this.project = {
        /**
         * Construct new project UI
         * @param {User} user User object
         */
        new: function(user){
            return Template.build(user, 'New Project', Template.content([`Create a new project::${ProjectCreator}`]))
        },
        /**
         * Construct project viewer UI
         * @param {User} user User object
         * @param {Promise<string>} projId Project ID
         * @returns {Promise<string>} HTML rendered project viewer
         */
        view: function(user, projId){
            return new Promise(async function(resolve){
                if(user.isUser && typeof projId === 'string'){
                    let viewProj = await ProjectManager.read(projId)
                    if(viewProj !== null)
                        resolve(Template.build(user, viewProj.name, ProjectViewer(user,viewProj)))
                }else
                    resolve(alert(_.PROJ.NOT_EXIST))
            })
        }
    }
    this.register = require('./register')
    /**
     * Render account settings.
     * @param {User} user user object
     * @returns {Promise<string>} HTML rendered string
     */
    this.setting = function(user){
        return new Promise(async function(resolve){
            try{
                resolve(Template.build(user, 'Settings', AccountSettings(new UserAccount(JSON.parse(await Mdb.read('usr.' + user.username))))))
            }catch(e){
                console.error('E: View.setting -> ' + e)
                resolve(alert(_.SRVR_ERR + e))
            }
        })
    }
}
const _view = new View()
module.exports = _view