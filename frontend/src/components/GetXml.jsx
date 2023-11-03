import { useTranslation } from "react-i18next";
import { encrypter } from './Encrypt';
import axios from "axios";


const GetXml = ({ cid }) => {

    const { t } = useTranslation();

    async function getDecriptionKey(){
        try {
            const email = sessionStorage.getItem('email');
			const url = "http://localhost:8080/api/getKeys";
			const { data: res } = await axios.post(url, {email: email});
			console.log(res.data.privateKey);
            return res.data.privateKey;
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

        } catch (error) {
            console.error('Error displaying file from IPFS:', error);
        }
    }

    return (
        <button onClick={getFileFromIpfs}>{t('getXml')}</button>
    );
}

export default GetXml;
