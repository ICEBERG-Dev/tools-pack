// Import the crypto module from Node.js
const crypto = require('crypto');

const hash_key = process.env.SECRET_KEY.substr(0,32);
const CRYPTO_KEY = Buffer.from(hash_key, 'binary')//.toString('utf8');

const base64_decode = (base64str) => {
    return Buffer.from(base64str, 'base64')//.toString('binary');//'binary'
}

function sayHello() {
  return "hey!";
}

const mc_decrypt = (val) => {
    val = base64_decode(val.replaceAll('.','&').replaceAll('~','/')).toString('utf8')
    const [encrypted, iv] = val.split('::').map(e=>base64_decode(e));
    const decipher = crypto.createDecipheriv('aes-256-cbc', CRYPTO_KEY.toString('binary'), iv);
    return decipher.update(encrypted) + decipher.final('utf8');
}

const mc_encrypt = (val) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', CRYPTO_KEY.toString('binary'), iv);
    const encrypted = Buffer.concat([cipher.update(val, 'utf8'), cipher.final()]).toString('base64');
    let enc = Buffer.from(encrypted + "::" + iv.toString('base64')).toString('base64');
    return enc.replaceAll('&','.').replaceAll('/','~')
}

const testencrypt = (req) => {
    return req.query.enc === "true" ? mc_encrypt(req.query.data) : mc_decrypt(req.query.data)
}

module.exports = {sayHello, mc_decrypt, mc_decrypt, mc_encrypt, testencrypt}
