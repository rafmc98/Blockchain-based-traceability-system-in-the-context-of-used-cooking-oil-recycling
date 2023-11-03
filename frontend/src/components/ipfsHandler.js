import { create } from "ipfs-http-client";
import { encrypter } from "./Encrypt";
import xml2js from 'xml2js';

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
        let fileEncrypted = encrypter.encryptDocument(fileToUpload);
        
;       try {
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
    }    
}

export { ipfsHandler }
