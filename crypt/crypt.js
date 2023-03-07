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

/*

PHP Analoge

function mc_encrypt($data) {
        $key_phrase = SECRET_KEY;
        $key = substr(hash('sha256', $key_phrase), 0, 32);
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
        return base64_encode(base64_encode($iv) .':'. base64_encode( $encrypted));
    }
    
    function mc_decrypt($data) {
        $data = base64_decode($data);
        $key_phrase = SECRET_KEY;
        $key = substr(hash('sha256', $key_phrase), 0, 32);
        $parts = explode(":", $data);
        $iv = base64_decode($parts[0]);
        $encrypted = base64_decode($parts[1]);
        return openssl_decrypt($encrypted, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);
    }

*/



module.exports = {encrypt, decrypt}
