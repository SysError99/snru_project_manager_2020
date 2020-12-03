'use strict'
const Express = require('express')
const _ = require('./const')
const UserAccount = require('./account')
const Hash = require('./hash')
const Mdb = require('./mdb')
const User = require('./user')
const View = require('./view/view')
const Xss = require('./xss')
/** @type {User[]} Logged in users */
const users = []
/** Authenticator class */
const AccountManager = function(){
    let A = this
    this.isAuth = true
    /**
     * Authenticate and return user object.
     * @param {string} token Active token.
     * @returns {User} User object
     */
    this.auth = function(token){
        if(typeof token !== 'string')
            return null
        for(let u=0; u<users.length; u++){
            let userObject = users[u]
            if(userObject.token === token)
                return userObject
        }
        return null
    }
    /** Account settings changer commands. */
    this.change = {
        /**
         * Write changes to server
         * @param {string} usrname Username
         * @param {any} obj Object to be written
         * @param {string} success Message to be shown when process is successful
         * @param {string} fail Message to be shown when process is failed
         * @returns {Promise<string>} Response string
         */
        write: function(usrname, obj, success, fail){
            return new Promise(async function(resolve){
                if(await Mdb.write('usr.' + usrname, JSON.stringify(obj)))
                    resolve(success)
                else
                    resolve(fail)
            })
        },
        /**
         * Change user category.
         * @param {User} usr User object
         * @param {string} category User category
         * @returns {Promise<string>} Response message
         */
        category: function(usr, category){
            return new Promise(async function(resolve){
                let account = await A.read(usr)
                account.category = category.split(',')
                resolve(A.change.write(
                    usr.username,
                    account.export(),
                    _.MSG.AUTH.CHANGE.CATEGORY.SUCCESS,
                    _.MSG.AUTH.CHANGE.CATEGORY.FAIL
                ))
            })
        },
        /**
         * Change password.
         * @param {User} usr User object
         * @param {string} oldpassword Old password
         * @param {string} newpassword New password
         * @returns {Promise<string>} Response message
         */
        password: function(usr, oldpassword, newpassword){
            return new Promise(async function(resolve){
                let account = await A.read(usr)
                if(!(await Hash.verify(oldpassword, account.password))){
                    resolve(_.MSG.AUTH.CHANGE.PWD.INVALID)
                    return
                }
                account.password = await Hash.perform(newpassword)
                resolve(A.change.write(
                    usr.username,
                    account.export(),
                    _.MSG.AUTH.CHANGE.PWD.SUCCESS,
                    _.MSG.AUTH.CHANGE.PWD.FAIL
                ))
            })
        },
        /**
         * Change Student ID
         * @param {User} usr User object
         * @param {string} stdid Student ID
         * @returns {Promise<string>} HTML response
         */
        stdid: function(usr, stdid){
            return new Promise(async function(resolve){
                let account = await A.read(usr)
                account.studentId = stdid
                resolve(A.change.write(
                    usr.username,
                    account.export(),
                    _.MSG.AUTH.CHANGE.PWD.SUCCESS,
                    _.MSG.AUTH.CHANGE.PWD.FAIL
                ))
            })
        }
    }
    /**
     * Perform logging in.
     * @param {Express.request} req Request object from express
     * @param {Express.response} res Response object from express
     * @returns {Promise<string>} HTML rendered string.
     */
    this.login = function(req,res){
        return new Promise(async function(resolve){
            let usr = Xss(req.body.username)
            let pwd = Xss(req.body.password)
            let data = await Mdb.read('usr.' + usr)
            if(data === null || data === ''){
                resolve(View.alert(_.MSG.AUTH.USR_NOT_EXIST))
                return
            }
            try{
                let usrData = new UserAccount(JSON.parse(data))
                if(
                    usrData.approved === false && (
                        usrData.type === 'committee' ||
                        usrData.type === 'teacher'
                    )
                )
                    resolve(View.alert(_.MSG.AUTH.UNAPPROVED))
                else if(await Hash.verify(pwd, usrData.password)){
                    let newUsr = new User(usr, usrData.type, usrData.name, usrData.category)
                    res.cookie('accessToken', newUsr.token, {signed: true})
                    users.push(newUsr)
                    resolve('302->/')
                }else
                    resolve(View.alert(_.MSG.AUTH.PWD_INVALID))
            }catch(e){
                console.error('E: Login -> while reading data from server: '+e)
                resolve(View.alert(_.SRVR_ERR) + e)
            }
        })
    }
    /**
     * Perform logout session.
     * @param {string} token Access token
     */
    this.logout = function(token){
        for(let u=0; u<users.length; u++){
            if(users[u].token === token){
                users.splice(u,1)
                break
            }
        }
    }
    /**
     * Register this user to database.
     * @param {string} usr Username
     * @param {string} pwd Password
     * @param {string} type User type
     * @param {string} name Legal name
     * @param {string} sid Student ID
     * @returns {Promise<string>} HTML rendered string
     */
    this.register = function(usr,pwd,type,name,sid){
        return new Promise(async function(resolve){
            if(usr.length < 3){
                resolve(View.alert(_.MSG.AUTH.USR_TOO_SHORT))
                return
            }
            if(pwd.length < 8){
                resolve(View.alert(_.MSG.AUTH.PWD_TOO_SHORT))
                return
            }
            if(
                type !== 'committee' &&
                type !== 'student' &&
                type !== 'teacher'
            ){
                resolve(View.alert(_.MSG.AUTH.USR_TYPE_INVALID))
                return
            }
            if(type === 'student' && sid.length < 11){
                resolve(View.alert(_.MSG.AUTH.SID_INVALID))
                return
            }
            let exists = await Mdb.find('usr.'+ usr)
            if(exists){
                resolve(View.alert(_.MSG.AUTH.USR_EXIST))
                return
            }
            let hPwd = await Hash.perform(pwd)
            let accountDetails = {
                username: usr,
                password: hPwd,
                type: type,
                name: name
            }
            if(
                type === 'student' &&
                typeof name === 'string' &&
                typeof sid === 'string'
            ){
                accountDetails.name = name
                accountDetails.sid = sid
            }
            let account = new UserAccount(accountDetails)
            if(!(await Mdb.write('usr.' + usr, JSON.stringify(account.export())))){
                console.error('E: Register -> while writing data to server: '+writeErr.message)
                resolve(View.alert(_.SRVR_ERR + ':' + writeErr))
                return
            }
            resolve(View.alert(_.MSG.AUTH.REG_SUCCESS))
        })
    }
    /**
     * Get account from database.
     * @param {User} usr User object
     * @returns {Promise<UserAccount>} Account object
     */
    this.read = function(usr){
        return new Promise(async function(resolve){
            resolve(new UserAccount(JSON.parse(await Mdb.read('usr.' + usr.username))))
        })
    }
}
setInterval(function(){ //interval
    users.forEach(function(user,index){
        if(user.age <= 0)
            users.splice(index,1)
        else
            user.age--
    })
},1000)
const _auth = new AccountManager()
module.exports = _auth