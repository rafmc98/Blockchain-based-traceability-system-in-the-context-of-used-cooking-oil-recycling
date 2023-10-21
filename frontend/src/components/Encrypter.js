import { useState, useEffect } from "react";

import CryptoJS from "crypto-js";

const Encrypter = () => {

    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [encryptedDocument, setEncryptedDocument] = useState("");
    const [decryptedDocument, setDecryptedDocument] = useState("");

    const [textToEncrypt, setTextToEncrypt] = useState('');
    const [encryptedText, setEncryptedText] = useState('');

    const generateKeyPair = () => {
        
        const newPrivateKey = CryptoJS.lib.WordArray.random(128).toString();
        const newPublicKey = CryptoJS.lib.WordArray.random(128).toString();

        setPrivateKey(newPrivateKey);
        setPublicKey(newPublicKey);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
      };
    
      const encryptDocument = () => {
        if (!selectedFile) {
          console.error("Seleziona un file da caricare.");
          return;
        }
    
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          try {
            const key = CryptoJS.enc.Utf8.parse(privateKey); // Converti la chiave privata in un formato utilizzabile
            const encrypted = CryptoJS.AES.encrypt(fileContent, key, {
              mode: CryptoJS.mode.ECB,
            }).toString();
            setEncryptedDocument(encrypted);
          } catch (error) {
            console.error("Errore durante la crittografia:", error);
          }
        };
    
        reader.readAsText(selectedFile);
      };
    
      const decryptDocument = () => {
        try {
          const key = CryptoJS.enc.Utf8.parse(privateKey); // Converti la chiave privata in un formato utilizzabile
          const decrypted = CryptoJS.AES.decrypt(encryptedDocument, key, {
            mode: CryptoJS.mode.ECB,
          }).toString(CryptoJS.enc.Utf8);
          setDecryptedDocument(decrypted);
        } catch (error) {
          console.error("Errore durante la decriptazione:", error);
        }
      };

      useEffect(() => {
        if (publicKey !== ''){ 
            console.log('Chiave Pubblica:', publicKey);
            console.log('Chiave Private:', privateKey);   
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

export default Encrypter;
