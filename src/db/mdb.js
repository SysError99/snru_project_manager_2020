const BodyParser = require('body-parser')
const Express = require('express')
const FileSystem = require('fs')
const _ = require('./const')
/**
 * Verify imcoming ip address
 * @param {string} ip Incoming IP address.
 * @returns {boolean} allowed?
 */
function verify(ip){
    if(_.INTERNAL_ONLY === false)
        return true 
    else{
        for(let v=0; v < _.INTERNAL_ADDR.length; v++){
            if(_.INTERNAL_ADDR[v] === ip)
                return true
        }
        return false
    }
}
/**
 * Express application
 */
const app = Express()
app.use(BodyParser.text({limit: '64mb'}));
app.use(BodyParser.urlencoded({limit: '64mb', extended: false }));
app.post('/add/:id', async function(request, response){
    if(verify(request.ip))
        FileSystem.appendFile('./obj/' + request.params.id + '.json', request.body, function(readErr){
            if(readErr){
                console.error(_.MSG.APPEND_ERR + request.params.id + readErr)
                response.send('fail')
            }else
                response.send('success')
        })
    else
        response.send('fail')
})
app.get('/find/:id', async function(request, response){
    if(verify(request.ip))
        FileSystem.access('./obj/' + request.params.id + '.json', FileSystem.constants.F_OK, function(readErr){
            if(readErr){
                console.error(_.MSG.READ_ERR + request.params.id + readErr)
                response.send('fail')
            }else
                response.send('success')
        })
    else
        response.send('fail')
})
app.get('/load/:id', async function(request, response){
    if(verify(request.ip))
        FileSystem.readFile('./obj/' + request.params.id + '.json', function(readErr, readData){
            if(readErr){
                console.error(_.MSG.READ_ERR + request.params.id + readErr)
                response.send('')
            }else
                response.send(readData)
        })
    else
        response.send('fail')
})
app.post('/save/:id', async function(request,response){
    if(verify(request.ip))
        FileSystem.writeFile('./obj/' + request.params.id + '.json', request.body, function(writeErr){
            if(writeErr){
                console.error(_.MSG.WRITE_ERR + request.params.id + writeErr)
                response.send('fail')
            }else
                response.send('success')
        })
    else
        response.send('fail')
})
/**
 * HTTP Server.
 */
const http = {server: null}
if(_.HTTPS){
    http.server = require('https').createServer({
        cert: _.SSL_CERT,
        key:  _.SSL_PKEY
    },app).server.listen(_.PORT)
    console.log ('- MicroDB HTTPS -')
}else
    app.listen(_.PORT,function(){
        console.log('- MicroDB -')
    })
