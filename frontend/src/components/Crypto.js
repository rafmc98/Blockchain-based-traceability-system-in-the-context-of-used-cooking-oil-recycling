import React, { useState, useEffect } from "react";
import forge from "node-forge";

const Crypto = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptedDocument, setEncryptedDocument] = useState("");
  const [decryptedDocument, setDecryptedDocument] = useState("");

  const generateKeyPair = () => {
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    setPublicKey(forge.pki.publicKeyToPem(keyPair.publicKey));
    setPrivateKey(forge.pki.privateKeyToPem(keyPair.privateKey));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const encryptDocument = () => {
    if (selectedFile && publicKey) {
      const reader = new FileReader();
      reader.onload = (e) => {
        //const content = e.target.result;
        const content = "Hello world";
        const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
        const encrypted = publicKeyObj.encrypt(content, "RSA-OAEP");
        setEncryptedDocument(forge.util.encode64(encrypted));
      };
      reader.readAsText(selectedFile);
    }
  };

  const decryptDocument = () => {
    if (encryptedDocument && privateKey) {
      const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
      const encryptedBytes = forge.util.decode64(encryptedDocument);
      const decrypted = privateKeyObj.decrypt(encryptedBytes, "RSA-OAEP");
      setDecryptedDocument(decrypted);
    }
  };

  useEffect(() => {
    if (publicKey !== "") {
      console.log("Chiave Pubblica:", publicKey);
    }
    if (privateKey !== "") {
      console.log("Chiave Private:", privateKey);
    }
  }, [publicKey, privateKey]);

  return (
    <div>
      <button onClick={generateKeyPair}>Create Key Pair</button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={encryptDocument}>Crittografa Documento</button>
      <p>Documento Cifrato: {encryptedDocument}</p>
      <button onClick={decryptDocument}>Decripta Documento</button>
      <p>Documento Decriptato: {decryptedDocument}</p>
    </div>
  );
};

export default Crypto;
