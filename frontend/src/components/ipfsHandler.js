import { create } from "ipfs-http-client";

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

        const jsonFile = JSON.parse(fileToUpload);
        const rfj = jsonFile.RFJ;
    
        try {
            console.log("Storing Wif on IPFS network");
    
            const result = await ipfs.add(fileToUpload);
    
            let params = {
                ipfsCid: result.path,
                rfj: rfj
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
