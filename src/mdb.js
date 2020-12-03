const HTTP = require('http')
const { resolve } = require('path')
/** IO counter */
/** @type {string} Host URL */
const url  = '::ffff:127.0.0.1'
/** @type {number} Host port */
const port = 8081
/**
 * Perform POST request.
 * @param {string} cmd Command type
 * @param {string} location Target location
 * @param {string} data Data to be written
 * @returns {Promise<boolean>} Is it success?
 */
const post = function(cmd, location, data){
    return new Promise(function(resolve){
        let writePostOptions = {
            hostname: url,
            port: port,
            path: '/' + cmd + '/'+location,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-length': Buffer.byteLength(data)
            }
        }
        let writeReq = HTTP.request(writePostOptions, function(writeRes){
            if(writeRes.statusCode !== 200){
                console.error('error code occured before POST: '+String(writeRes.statusCode))
                resolve(null)
                return
            }
            let writeRawData = ''
            writeRes.setEncoding('utf8')
            writeRes.on('data', function(chunk){
                writeRawData += chunk
            })
            writeRes.on('end', function(){
                if(writeRawData === 'success')
                    resolve(true)
                else{
                    console.error('E: Mdb.' + cmd + ' -> Server can\'t ' + cmd + ' data, lookup on database')
                    resolve(false)
                }
            })
        })
        writeReq.on('error', function(httpErr){
            console.error('E: Mdb.' + cmd +  ' -> Can\'t perform POST request on '+location+'::'+httpErr.message)
            resolve(null)
        })
        writeReq.write(data)
        writeReq.end()
    })
}
/** MDB functions */
const Mdb = function(){
    /**
     * Append data.
     * @param {string} location 
     * @param {string} data 
     * @returns {Promise<boolean>} Is it success?
     */
    this.add = function(location, data){
        return post('add', location, data)
    }
    /**
     * Check if data exists.
     * @param {string} location Data location
     * @returns {Promise<boolean>} Does data exist?
     */
    this.find = function(location){
        return new Promise(function(resolve){
            let readGetOptions = {
                hostname: url,
                port: port,
                path: '/load/'+location,
                method: 'GET'
            }
            let readReq = HTTP.request(readGetOptions, function(readRes){
                if(readRes.statusCode !== 200){
                    console.error('E: Mdb.read -> Server response: ' + readRes.statusCode)
                    readRes.resume()
                    resolve(null)
                    return
                }
                let readRawData = ''
                readRes.setEncoding('utf8')
                readRes.on('data', function(chunk){
                    readRawData += chunk
                })
                readRes.on('end', function(){
                    if(readRawData === 'fail')
                        resolve(false)
                    else if(readRawData === 'success')
                        resolve(true)
                    else
                        resolve(null)
                })
            })
            readReq.on('error', function(httpErr){
                console.error('E: Mdb.find -> Can\'t perform GET request on '+location+'::'+httpErr.message)
                resolve(null)
            })
            readReq.end()
        })
    }
    /**
     * Perform GET to load data from main server.
     * @param {string} location Location of data
     * @returns {Promise<string>} Data received.
     */
    this.read = function(location){
        return new Promise(function(resolve){
            let readGetOptions = {
                hostname: url,
                port: port,
                path: '/load/'+location,
                method: 'GET'
            }
            let readReq = HTTP.request(readGetOptions, function(readRes){
                if(readRes.statusCode !== 200){
                    console.error('server Error '+String(readRes.statusCode))
                    readRes.resume()
                    resolve(null)
                    return
                }
                let readRawData = ''
                readRes.setEncoding('utf8')
                readRes.on('data', function(chunk){
                    readRawData += chunk
                })
                readRes.on('end', function(){
                    resolve(readRawData)
                })
            })
            readReq.on('error', function(httpErr){
                console.error('Can\'t perform GET request on '+location+'::'+httpErr.message)
                resolve(null)
            })
            readReq.end()
        })
    }
    /**
     * Perform POST to save data from main server.
     * @param {string} location Location of data
     * @param {string} data Data to be written into
     * @returns {Promise<boolean>} Had data be written?
     */
    this.write =  function(location, data){
        return post('save', location, data)
    }
}
const _mdb = new Mdb()
module.exports = _mdb