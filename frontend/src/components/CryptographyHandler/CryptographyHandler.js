import xml2js from 'xml2js';
import forge from 'node-forge';

class CryptographyHandler {
  constructor() {
    this.publicKeyObj = forge.pki.publicKeyFromPem(process.env.REACT_APP_ENCRYPTION_PUBLIC_KEY);
  }

  encryptDocument = async function (fileToUpload) {
    let encryptedXmlString = '';
    xml2js.parseString(fileToUpload, (err, result) => {
      if (err) {
        console.error("Error parsing XML string:", err);
      } else {
        const encryptedData = this.recursiveEncrypt(result.formData);
        const newXML = { formData: encryptedData };
        const builder = new xml2js.Builder();
        encryptedXmlString = builder.buildObject(newXML);
        console.log(encryptedXmlString);
      }
    });
    return encryptedXmlString;
  }

  decryptDocument = async function (privateKey, encryptedDocument) {
    let decryptedData = '';
    xml2js.parseString(encryptedDocument, (err, result) => {
      if (err) {
        console.error("Error parsing XML file:", err);
      } else {
        const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
        decryptedData = this.recursiveDecrypt(result.formData, privateKeyObj);
      }
    });
    return decryptedData;
  }

  recursiveEncrypt(obj) {
    const encryptedData = {};

    for (const field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (typeof obj[field][0] === 'object') {
          encryptedData[field] = this.recursiveEncrypt(obj[field][0]);
        } else {
          let value = obj[field][0];
          if (value){
            value = this.publicKeyObj.encrypt(value, "RSA-OAEP");
            encryptedData[field] = forge.util.encode64(value);
          } else {
            encryptedData[field] = '';
          }
        }
      }
    }

    return encryptedData;
  }

  recursiveDecrypt(obj, privateKeyObj) {
    const decryptedData = {};

    for (const field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (typeof obj[field][0] === 'object') {
          decryptedData[field] = this.recursiveDecrypt(obj[field][0], privateKeyObj);
        } else {
          let value = obj[field][0];
          if (value) {
            value = forge.util.decode64(value);
            value = privateKeyObj.decrypt(value, 'RSA-OAEP');
          }
          decryptedData[field] = value;
        }
      }
    }
    return decryptedData;
  }
}

const cryptographyHandler = new CryptographyHandler();

export { cryptographyHandler };
