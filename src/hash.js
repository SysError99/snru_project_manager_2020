const Crypto = require('crypto')
const hash = {
    /**
     * Hash a password
     * @param {string} pwd password to be hashed
     * @returns {Promise<string>} Hashed string
     */
    perform: function(pwd){
        return new Promise(function(resolve){
            if(pwd === ''){
                resolve('')
                return
            }
            let salt = Crypto.randomBytes(8).toString('hex')
            Crypto.scrypt(pwd, salt, 64, function(err, derivedKey){
                if(err){
                    resolve('')
                    return
                }
                resolve(salt + ":" + derivedKey.toString('hex'))
            })
        })
    },
    /**
     * Random hex value.
     * @param {number} len Length of hex value.
     * @returns {string} Random hex string.
     */
    randHex: function(len){
        return Crypto.randomBytes(Math.ceil(len/2))
            .toString('hex')
            .slice(0,len).toUpperCase()
    },
    /**
     * Verify password with hash
     * @param {string} password Password
     * @param {string} hash Hash value
     * @returns {Promise<boolean>} Is password correct?
     */
    verify: function(password, hash){
        return new Promise((resolve, reject) => {
            const [salt, key] = hash.split(":")
            Crypto.scrypt(password, salt, 64, function(err, derivedKey){
                if(err){
                    resolve(false)
                    return
                }
                resolve(key == derivedKey.toString('hex'))
            })
        })
    }
}
module.exports = hash