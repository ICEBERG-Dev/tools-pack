const crypto = require('crypto');

function encrypt(data) {
    const key_phrase = process.env.SECRET_KEY;
    const key = crypto.createHash('sha256').update(key_phrase).digest('hex').substr(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return Buffer.from(iv.toString('base64') + ':' + encrypted.toString('base64')).toString('base64');
}

function decrypt(data) {
    data = Buffer.from(data, 'base64').toString()
    const key_phrase = process.env.SECRET_KEY;
    const key = crypto.createHash('sha256').update(key_phrase).digest('hex').substr(0, 32);
    const parts = data.split(':');
    const iv = Buffer.from(parts[0], 'base64');
    const encrypted = Buffer.from(parts[1], 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {encrypt, decrypt}
