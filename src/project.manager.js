const _ = require('./const')
const CommentObject = require('./comment')
const Mdb = require('./mdb')
const Project = require('./project')
const User = require('./user')
/** @type {string[]} Project index */
let projects = [];
(async function(){
    let data = await Mdb.read('index')
    try{
        projects = data.split('||')
        if(projects[0] === '')
            projects = projects.slice(1)
    }catch(e){
        throw Error(_.MSG.ERR_INDEX_PARSE + e)
    }
})()
/** Main app object */
const ProjectManager = function(){
    let A = this
    this.isProjectManager = true
    /**
     * Add a new project to database.
     * @param {User} usr User object
     * @param {Project} proj Project to be added 
     * @returns {Promise<string>} Project creation message
     */
    this.add = function(usr,proj){
        return new Promise(async function(resolve){
            if(usr.type !== 'student'){
                resolve(_.MSG.AUTH.UNAUTHORIZED)
                return
            }
            if(await Mdb.find('proj.' + proj.id)){
                resolve(_.MSG.PROJ.ADD.EXIST)
                return
            }
            let projCategory = ''
            let projTeacher = ''
            proj.owner.push(usr.name)
            proj.category.forEach(function(c){
                projCategory += c + ','
            })
            proj.teacher.forEach(function(t){
                projTeacher += t + ','
            })
            let projQuery = proj.name + '::' + usr.name + '::' + projCategory + '::' + projTeacher + '::' + proj.id
            let projWriteData = await Mdb.write('proj.' + proj.id, JSON.stringify(proj.export()))
            let projWriteIndex = await Mdb.add('index', '||' + projQuery)
            if(!projWriteData || ! projWriteIndex){
                console.error('E: ProjectManager.add -> Can\'t write data, look out at log or database.')
                resolve(_.MSG.PROJ.ADD.ERR)
                return
            }
            resolve(_.MSG.PROJ.ADD.SUCCESS)
        })
    }
    /**
     * Approve this project
     * @param {User} usr User object
     * @param {string} projId Project ID
     * @param {string} type Project type
     * @returns {Promise<string>} HTML response
     */
    this.approve = function(usr,projId,type){
        return new Promise(async function(resolve){
            if(usr.type !== 'committee'){
                resolve(_.MSG.AUTH.UNAUTHORIZED)
                return
            }
            let project = await A.read(projId)
            if(project === null){
                resolve(_.MSG.PROJ.APPROVE.INVALID)
                return
            }
            /** @type {string[]} List of approved list*/
            let approveList = project[type + 'Approve']
            if(!Array.isArray(approveList)){
                resolve(_.MSG.PROJ.APPROVE.INVALID)
                return
            }
            let approvedIndex = approveList.findIndex(ele => ele === usr.name)
            if(approvedIndex === -1){
                approveList.push(usr.name)
                if(!(await Mdb.write('proj.' + project.id, JSON.stringify(project.export())))){
                    resolve(_.MSG.PROJ.APPROVE.FAIL)
                    return
                }
            }
            resolve(_.MSG.PROJ.APPROVE.SUCCESS)
        })   
    }
    /**
     * Comment to the project
     * @param {User} usr User object
     * @param {string} projId Project ID
     * @param {string} comment Comment to be inserted
     * @returns {Promise<string>} HTML respnose message
     */
    this.comment = function(usr, projId, comment){
        return new Promise(async function(resolve){
            let project = await A.read(projId)
            if(project === null){
                resolve(_.MSG.PROJ.COMMENT.INVALID)
                return
            }
            project.comment.push(new CommentObject({
                name: usr.name,
                type: usr.type,
                text: comment
            }))
            if(!(await Mdb.write('proj.' + project.id, JSON.stringify(project.export())))){
                resolve(_.MSG.PROJ.COMMENT.FAIL)
                return
            }
            resolve(_.MSG.PROJ.COMMENT.SUCCESS)
        })
    }
    /**
     * Disapprove project
     * @param {User} usr User object
     * @param {string} projId Project ID
     * @param {string} type Project type
     * @returns {Promise<string>} HTML response
     */
    this.disapprove = function(usr,projId,type){
        return new Promise(async function(resolve){
            if(usr.type !== 'committee'){
                resolve(_.MSG.PROJ.DISAPPROVE.INVALID)
                return
            }
            let project = await A.read(projId)
            if(project === null){
                resolve(_.MSG.PROJ.DISAPPROVE.INVALID)
                return
            }
            /** @type {string[]} List of approved list*/
            let approveList = project[type + 'Approve']
            if(!Array.isArray(approveList)){
                resolve(_.MSG.PROJ.DISAPPROVE.INVALID)
                return
            }
            let approvedIndex = approveList.findIndex(ele => ele === usr.name)
            if(approvedIndex !== -1){
                approveList.splice(approvedIndex,1)
                if(!(await Mdb.write('proj.' + project.id, JSON.stringify(project.export())))){
                    resolve(_.MSG.PROJ.DISAPPROVE.FAIL)
                    return
                }
            }
            resolve(_.MSG.PROJ.DISAPPROVE.SUCCESS)
        })
    }
    /**
     * Edit project.
     * @param {User} usr User object
     * @param {string} projId Project ID
     * @param {string} name Project name
     * @param {string} owner Project owner
     * @param {string} category Project category
     * @param {string} teacher Project teacher
     * @returns {Promise<string>} HTML response
     */
    this.edit = function(usr,projId, name, owner, category, teacher){
        return new Promise(async function(resolve){
            let project = await A.read(projId)
            if(project === null){
                resolve(_.MSG.PROJ.EDIT.INVALID)
                return
            }
            if(!A.perm(usr,project)){
                resolve(_.MSG.PROJ.EDIT.INVALID)
            }
            project.name = name
            project.owner = owner.split(',')
            project.category = category.split(',')
            project.teacher = teacher.split(',')
            for(let p=0; p<projects.length; p++){
                let proj = projects[p].split('::')
                proj[0] = name
                proj[1] = owner
                proj[2] = category
                proj[3] = teacher
                projects[p] = proj.join('::')
            }
            if(!(await Mdb.write('proj.' + project.id, JSON.stringify(project.export())))){
                resolve(_.MSG.PROJ.EDIT.FAIL)
                return
            }
            if(!(await Mdb.write('index', projects.join('||')))){
                resolve(_.MSG.PROJ.EDIT.FAIL)
                return
            }
            resolve(_.MSG.PROJ.EDIT.SUCCESS)
        })
    }
    /**
     * Fetch projects by keywords.
     * @param {string[]} keyword Keywords.
     * @returns {string[][]} Project index list.
     */
    this.fetch = function(keyword){
        /** @type {string[]} Search result */
        let res = []
        projects.forEach(function(proj){
            keyword.forEach(function(k){
                if(proj.split(k) <= 1)
                    return
                let project = proj.split('::')
                for(let f=0; f<res.length; f++){
                    if(res[f][0] === project[0])
                        return
                }
                res.push(project)
            })
        })
        return res
    }
    /**
     * Verify project permission.
     * @param {User} usr User object
     * @param {Project} proj Project object
     * @return {boolean} Permission granted?
     */
    this.perm = function(usr,proj){
        for(let p=0; p<proj.owner.length;p++){
            if(proj.owner[p] === usr.name)
                return true
        }
        return false
    }
    /**
     * Read project from database.
     * @param {string} projId Project ID
     * @returns {Promise<Project>} Project object
     */
    this.read = function(projId){
        return new Promise(async function(resolve){
            try{
                resolve(new Project(JSON.parse(await Mdb.read('proj.' + projId))))
            }catch(e){
                console.error('E: ProjectManager.read -> ' + e)
                resolve(null)
            }
        })
    }
    /**
     * Submit string to project
     * @param {User} usr User object
     * @param {string} projId Project ID
     * @param {string} type Upload type
     * @param {string} fname File name
     * @param {string} base64 Base64 string
     * @param {string} content Content type
     * @returns {Promise<string>} HTML  response
     */
    this.submit = function(usr,projId,type,fname,base64,content){
        return new Promise(async function(resolve){
            let project = await A.read(projId)
            if(project === null){
                resolve(_.MSG.PROJ.SUBMIT.INVALID)
                return
            }
            if(!A.perm(usr,project)){
                resolve(_.MSG.PROJ.SUBMIT.INVALID)
                return
            }
            let fnameArray = fname.split('.')
            let fnameExtension = '.' + fnameArray[fnameArray.length-1]
            let fileName = project.id + (new Date().toISOString().split(':').join('_').split('.').join('_')) + fnameExtension
            if(typeof project[type] !== 'string'){
                resolve(_.MSG.PROJ.SUBMIT.INVALID)
                return
            }
            project[type] = fileName
            if(!(await Mdb.write(fileName, JSON.stringify([content,base64])))){
                resolve(_.MSG.PROJ.SUBMIT.FAIL)
                return
            }
            if(!(await Mdb.write('proj.' + project.id, JSON.stringify(project.export())))){
                resolve(_.MSG.PROJ.SUBMIT.FAIL)
                return
            }
            resolve(_.MSG.PROJ.SUBMIT.SUCCESS)
        })
    }
}
const _projectManager = new ProjectManager()
module.exports = _projectManager