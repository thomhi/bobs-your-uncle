import CryptoJS from 'crypto-js';

class CryptoService {
    hashPassword(password : string) : string {
        // eslint-disable-next-line new-cap
        return CryptoJS.SHA512(process.env.NONCE + password).toString(CryptoJS.enc.Hex);
    }
}

export default new CryptoService();
