import React, { useState, useEffect } from 'react';
import xml2js from 'xml2js';
import forge from 'node-forge';
import FileSaver from 'file-saver';

const Codifica = () => {
  const [file, setFile] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [encryptedXML, setEncryptedXML] = useState(null);
  const [decryptedXML, setDecryptedXML] = useState(null);

  const generateKeyPair = () => {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const newPublicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
    const newPrivateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
    setPublicKey(newPublicKey);
    setPrivateKey(newPrivateKey);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      encryptData(uploadedFile);
    }
  };

  const encryptData = (file) => {
    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);

    const reader = new FileReader();

    reader.onload = (event) => {
      const xmlString = event.target.result;

      xml2js.parseString(xmlString, (err, result) => {
        if (err) {
          console.error("Error parsing XML file:", err);
        } else {
          const encryptedData = recursiveEncrypt(result.formData, publicKeyObj);
          const newXML = { formData: encryptedData };
          const builder = new xml2js.Builder();
          const newXMLString = builder.buildObject(newXML);
          console.log(newXMLString);
          setEncryptedXML(newXMLString);
        }
      });
    };

    reader.readAsText(file);
  };

  const recursiveEncrypt = (obj, publicKeyObj) => {
    const encryptedData = {};

    for (const field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (typeof obj[field][0] === 'object') {
          encryptedData[field] = recursiveEncrypt(obj[field][0], publicKeyObj);
        } else {
          let value = obj[field][0];
          value = publicKeyObj.encrypt(value, "RSA-OAEP");
          encryptedData[field] = forge.util.encode64(value);
        }
      }
    }

    return encryptedData;
  };

  const saveXML = (xmlString) => {
    if (xmlString) {
      const newXML = { formData: xmlString };
      const builder = new xml2js.Builder();
      const xml = builder.buildObject(newXML);
      const blob = new Blob([xml], { type: 'application/xml' });
      FileSaver.saveAs(blob, 'fir.xml');
    }
  };

  const decryptData = () => {
    if (privateKey && encryptedXML) {
      xml2js.parseString(encryptedXML, (err, result) => {
        if (err) {
          console.error("Error parsing XML file:", err);
        } else {
          const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
          const decryptedData = recursiveDecrypt(result.formData, privateKeyObj);
          setDecryptedXML(decryptedData);
          saveXML(decryptedData)
        }
      }); 
    }
  };

  const recursiveDecrypt = (obj, privateKeyObj) => {
    const decryptedData = {};

    for (const field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (typeof obj[field][0] === 'object') {
          decryptedData[field] = recursiveDecrypt(obj[field][0], privateKeyObj);
        } else {
          let value = obj[field][0];
          value = forge.util.decode64(value);
          value = privateKeyObj.decrypt(value, 'RSA-OAEP');
          decryptedData[field] = value;
        }
      }
    }
    return decryptedData;
  };

  useEffect(() => {
    console.log(privateKey);
    console.log(publicKey);
    if (publicKey !== null) console.log("Keys created");
  }, [publicKey, privateKey])
  return (
    <div>
      <button onClick={generateKeyPair}>Generate Key Pair</button>
      <input type="file" accept=".xml" onChange={handleFileUpload} />
      <button onClick={decryptData}>Decrypt Data</button>
    </div>
  );
}

export default Codifica;
