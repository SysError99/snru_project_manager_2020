
const BodyParser = require('body-parser')
const CookieParser = require('cookie-parser')
const Express = require('express')
const Multer = require('multer')
const _ = require('./const')
const Xss = require('./xss')
const AccountManager = require('./account.manager')
const Mdb = require('./mdb')
const Project = require('./project')
const ProjectManager = require('./project.manager')
const User = require('./user')
const View = require('./view/view')
const upload = Multer({ storage: Multer.memoryStorage({}) });
/**
 * @callback authCallback Authentication callback
 * @param {User} user User object
 */
/**
 * Authenticate user before perform actions.
 * @param {Express.request} req Target request
 * @param {Express.response} res Target response
 * @param {authCallback} func Function to be called after authentication
 */
const auth = function(req,res,func){
    let user = AccountManager.auth(req.signedCookies.accessToken)
    if(user === null){
        switch(req.params.page){
            case 'register':
                res.send(View.register)
                break
            default:
                res.send(View.login)
                break
        }
        return
    }
    func(user)
}
/**
 * Slice a string by 5
 * @param {string} str String to be sliced
 * @returns {string} Sliced string
 */
const resParse_slice = function(str){
    return str.slice(5,str.length)
}
/**
 * Parse response and execute.
 * @param {Express.response} res Target response
 * @param {string} str Target string
 */
const resParse = function(res, str){
    if(str[0] + str[1] === '->')
        res.send(str.slice(2,str.length))
    else if(str[3] + str[4] === '->'){
        let resStatus = parseInt(str[0] + str[1] + str[2])
        if(resStatus !== NaN){
            if(resStatus >= 300 && resStatus < 400)
                res.redirect(resStatus, resParse_slice(str))
            else
                res.status(resStatus).send(resParse_slice(str))
        }else
            res.send(str)
    }
    else
        res.send(str)
}
/** Express app */
const app = Express()
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(BodyParser.raw());
app.use(CookieParser('aPpCxLiCaXtIoN'))
app.use(Express.static('public'))
app.get('/:page', function(req,res){
    auth(req, res, async function(user){
        switch(req.params.page){
            case 'logout':
                AccountManager.logout(user.token)
                resParse(res, '302->/')
                break
            case 'projnew':
                res.send(View.project.new(user))
                break
            case 'projview':
                res.send(await View.project.view(user, req.query.id))
                break
            case 'setting':
                res.send(await View.setting(user))
                break
            default:
                res.send(View.home(user))
                break
        }
    })
})
app.get('/', function(req,res){
    auth(req, res, function(){
        res.redirect('/home')
    })
})
app.get('/file/:id', function(req,res){
    if(typeof req.params.id !== 'string'){
        res.send(View.alert('file Invalid.'))
    }
    auth(req,res,async function(){
        try{
            /** @type {string[]} Array of base64 file */
            let file = JSON.parse(await Mdb.read(req.params.id))
            res.contentType(file[0]).end(Buffer.from(file[1], 'base64'))
        }catch(e){
            res.send(View.alert('file invalid.'))
        }
    })
})
app.post('/login', async function(req,res){
    if(
        AccountManager.auth(req.body.accessToken) !== null ||
        typeof req.body.username !== 'string' ||
        typeof req.body.password !== 'string'
    ){
        res.redirect('/')
        return
    }
    resParse(res, await AccountManager.login(req, res))
})
app.post('/register', async function(req,res){
    if(
        typeof req.body.name !== 'string' ||
        typeof req.body.password !== 'string' ||
        typeof req.body.type !== 'string' ||
        typeof req.body.name !== 'string' ||
        typeof req.body.stdId !== 'string'
    ){
        res.send(View.alert(_.MSG.AUTH.DATA_INVALID))
        return
    }
    resParse(res, await AccountManager.register(
        Xss(req.body.username),
        Xss(req.body.password),
        Xss(req.body.type),
        Xss(req.body.name),
        Xss(req.body.stdId)
    ))
})
app.post('/projnew', function(req,res){
    if(
        typeof req.body.name !== 'string' ||
        typeof req.body.category !== 'string' ||
        typeof req.body.teacher !== 'string'
    ){
        res.send(View.alert(_.MSG.PROJ.ADD.INVALID))
        return
    }
    auth(req, res, async function(user){
        if(user.type !== 'student'){
            res.send(View.alert(_.MSG.INVALID_PERM))
            return
        }
        let projectCreationStatus = await ProjectManager.add(user, new Project({
            name: Xss(req.body.name),
            category: Xss(req.body.category.split(',')),
            teacher: Xss(req.body.teacher.split(','))
        }))
        res.send(View.alert(projectCreationStatus))
    })
})
app.post('/changecategory', function(req,res){
    if(typeof req.body.category !== 'string' ){
        res.send(View.alert(_.MSG.AUTH.CHANGE.INVALID,'setting'))
        return
    }
    auth(req, res, async function(user){
        res.send(View.alert(await AccountManager.change.category(user, Xss(req.body.category))))
    })
})
app.post('/changepassword', function(req,res){
    if(
        typeof req.body.oldpassword !== 'string' ||
        typeof req.body.password0 !== 'string' ||
        typeof req.body.password1 !== 'string'
    ){
        res.send(View.alert(_.MSG.AUTH.CHANGE.INVALID))
        return
    }
    auth(req, res, async function(user){
        res.send(View.alert(await AccountManager.change.password(user, Xss(req.body.oldpassword), Xss(req.body.password0))))
    })
})
app.post('/changestdid', function(req,res){
    if(typeof req.body.stdid !== 'string'){
        res.send(_.MSG.AUTH.CHANGE.STDID.INVALID)
        return
    }
    auth(req,res,async function(user){
        req.send(View.alert(await AccountManager.change.stdid(user, Xss(req.body.stdid))))
    })
})
app.get('/projapprove/:type/:id', function(req,res){
    if(
        typeof req.params.id !== 'string' ||
        typeof req.params.type !== 'string'
    ){
        res.send(View.alert(_.MSG.PROJ.APPROVE.INVALID))
        return
    }
    auth(req,res,async function(user){
        res.send(View.alert(await ProjectManager.approve(user, req.params.id, req.params.type)))
    })
})
app.get('/projdisapprove/:type/:id', function(req,res){
    if(
        typeof req.params.id !== 'string' ||
        typeof req.params.type !== 'string'
    ){
        res.send(View.alert(_.MSG.PROJ.APPROVE.INVALID))
        return
    }
    auth(req,res,async function(user){
        res.send(View.alert(await ProjectManager.disapprove(user, req.params.id, req.params.type)))
    })
})
app.post('/projcomment/:id', function(req,res){
    if(
        typeof req.params.id !== 'string' ||
        typeof req.body.text !== 'string'
    ){
        res.send(View.alert(_.MSG.PROJ.COMMENT.INVALID))
        return
    }
    auth(req,res,async function(user){
        res.send(View.alert(await ProjectManager.comment(user, req.params.id, Xss(req.body.text))))
    })
})
app.post('/projedit/:id', function(req,res){
    if(
        typeof req.params.id !== 'string' ||
        typeof req.body.name !== 'string' ||
        typeof req.body.owner !== 'string' ||
        typeof req.body.category !== 'string' ||
        typeof req.body.teacher !== 'string'
    ){
        res.send(View.alert(_.MSG.PROJ.EDIT.INVALID))
        return
    }
    auth(req,res,async function(user){
        res.send(View.alert(await ProjectManager.edit(
            user,
            req.params.id,
            Xss(req.body.name),
            Xss(req.body.owner),
            Xss(req.body.category), 
            Xss(req.body.teacher)
        )))
    })
})
app.post('/projsubmit/:type/:id', upload.single('file'), function(req,res){
    if(
        !Buffer.isBuffer(req.file.buffer) ||
        typeof req.params.type !== 'string' ||
        typeof req.params.id !== 'string'
    ){
        res.send(View.alert(_.MSG.PROJ.UP.INVALID))
        return
    }
    auth(req,res,async function(user){
        res.send(View.alert(await ProjectManager.submit(
            user,
            req.params.id,
            req.params.type,
            req.file.originalname,
            req.file.buffer.toString('base64'),
            req.file.mimetype
        )))
    })
})
app.listen(_.PORT, function(){
    console.log('Server is running at port '+String(_.PORT)+'!')
})