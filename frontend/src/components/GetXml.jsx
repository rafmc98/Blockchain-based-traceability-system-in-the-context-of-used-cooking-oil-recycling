import { useTranslation } from "react-i18next";
import { encrypter } from './Encrypter';
import axios from "axios";
import { saveAs } from 'file-saver';
import xml2js from 'xml2js';

const GetXml = ({ cid }) => {

    const { t } = useTranslation();

    async function getDecriptionKey(){
        try {
            const email = sessionStorage.getItem('email');
			const url = "http://localhost:8080/api/getKeys";
			const { data: res } = await axios.post(url, {email: email});
            return res.data.privateKey;
		} catch (error) {
			alert("Non sei autorizzato ad eseguire questa operazione")
		}
    }

    async function getFileFromIpfs() {
        try {
            const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
            const fileContent = await response.text();

            let privateKey = await getDecriptionKey();
            const decrypted = await encrypter.decryptDocument(privateKey, fileContent);

            const newXML = { formData: decrypted };  
            // Converti l'oggetto JSON nuovamente in XML
            const builder = new xml2js.Builder();
            const xml = builder.buildObject(newXML);
    
            // Crea un nuovo Blob con il contenuto XML
            const blob = new Blob([xml], { type: 'application/xml' });
    
            // Effettua il download del file
            saveAs(blob, 'xFir.xml');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <button onClick={getFileFromIpfs}>{t('getXml')}</button>
    );
}

export default GetXml;
