import { useTranslation } from "react-i18next";
import { encrypter } from './Encrypt';
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
			//console.log(res.data.privateKey);
            return res.data.publicKey;
		} catch (error) {
			alert("Non sei autorizzato ad eseguire questa operazione")
		}
    }

    async function getFileFromIpfs() {
        try {
            const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
            const fileContent = await response.text();
            console.log(fileContent);

            const privateKey = await getDecriptionKey();

            const decrypted = encrypter.decryptDocument(privateKey, fileContent);

            console.log(decrypted);

            xml2js.parseString(decrypted, (error, result) => {
                if (error) {
                  console.error('Errore durante la conversione XML in JSON:', error);
                } else {
                  // Converti l'oggetto JSON nuovamente in XML
                  const builder = new xml2js.Builder();
                  const xml = builder.buildObject(result);
          
                  // Crea un nuovo Blob con il contenuto XML
                  const blob = new Blob([xml], { type: 'text/xml' });
          
                  // Effettua il download del file
                  saveAs(blob, 'documento.xml');
                }
            });
        } catch (error) {
            console.error('Error displaying file from IPFS:', error);
        }
    }

    return (
        <button onClick={getFileFromIpfs}>{t('getXml')}</button>
    );
}

export default GetXml;
