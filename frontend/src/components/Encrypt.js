import CryptoJS from 'crypto-js';

const encrypter = {

    decryptDocument: (privateKey, encryptedDocument) => {
        try {
            const key = CryptoJS.enc.Utf8.parse(privateKey);
            const decrypted = CryptoJS.AES.decrypt(encryptedDocument, key, {
                mode: CryptoJS.mode.ECB,
            }).toString(CryptoJS.enc.Utf8);
            return decrypted;
        } catch (error) {
            console.error("Errore durante la decriptazione:", error);
        }
    },

    encryptDocument: (fileToUpload) => {
        try {
            const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_PUBLIC_KEY);
            const encrypted = CryptoJS.AES.encrypt(fileToUpload, key, {
                mode: CryptoJS.mode.ECB,
                }).toString();
            return encrypted
        } catch (error) {
            console.error("Errore durante la crittografia:", error);
        }
    }

};

export { encrypter };
