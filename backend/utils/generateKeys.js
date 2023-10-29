const CryptoJS = require('crypto-js')

const generateKeysPair = () => {
    
    const publicKey = CryptoJS.lib.WordArray.random(128).toString();
    const privateKey = CryptoJS.lib.WordArray.random(128).toString();

    return { publicKey, privateKey}
};

module.exports = { generateKeysPair };