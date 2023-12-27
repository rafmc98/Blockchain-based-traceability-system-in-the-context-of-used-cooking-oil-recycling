import { create } from "ipfs-http-client";
import { cryptographyHandler } from "../CryptographyHandler/CryptographyHandler";
import xml2js from 'xml2js';
import axios from "axios";
import { saveAs } from 'file-saver';


const ipfsHandler = {
    async storeWif(fileToUpload) {
        const projectId = process.env.REACT_APP_PROJECT_ID;
        const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
        const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
    
        const ipfs = create({
            url: "https://ipfs.infura.io:5001/api/v0",
            headers: {
                authorization,
            },
        });

        let idDoc = '';
        xml2js.parseString(fileToUpload, (err, result) => {
            if (err) {
              console.error("Error parsing XML file:", err);
            } else {
              idDoc = result.formData.IdDocumento[0];
              console.log(idDoc);
            }
        });
       
        console.log("Encrypting document... ");
        console.log(fileToUpload);
        let fileEncrypted = await cryptographyHandler.encryptDocument(fileToUpload);
        console.log(fileEncrypted);
               
        try {
            console.log("Storing Wif on IPFS network");
    
            const result = await ipfs.add(fileEncrypted);
    
            let params = {
                ipfsCid: result.path,
                rfj: idDoc
            };
    
            console.log("Wif stored on IPFS network: ", {
                ipfsCid: params.ipfsCid,
                rfj: params.rfj
            });
    
            console.log('Link to Wif document : https://ipfs.io/ipfs/' + result.path);
            
            return params;
    
        } catch (error) {
            console.log(error);
        }
    },

    async getFileFromIpfs(cid) {
        try {
            const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
            const fileContent = await response.text();

            const email = sessionStorage.getItem('email');
            const url = "http://localhost:8080/api/getKeys";
            const { data: res } = await axios.post(url, {email: email});

            let privateKey = res.data.privateKey;
    
            const decrypted = await cryptographyHandler.decryptDocument(privateKey, fileContent);

            const newXML = { formData: decrypted };  
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(newXML);
    
            const blob = new Blob([xml], { type: 'application/xml' });
    
            saveAs(blob, 'xFir.xml');
        } catch (error) {
            console.error(error);
        }
    }
}

export { ipfsHandler }
