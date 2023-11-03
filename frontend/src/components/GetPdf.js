import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useTranslation } from 'react-i18next';

import wifTemplate from '../wif.pdf'

const GetPdf = ({ cid }) => {

    const { t } = useTranslation();

    async function getFileFromIpfs() {
        try {
            const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
            const fileContent = await response.text();
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error displaying file from IPFS:', error);
        }
      }

    async function addTextToPDF() {

        const wifJson = getFileFromIpfs();

        const response = await fetch(wifTemplate);

        const existingPdfBytes = await response.arrayBuffer();

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
        // Crea una nuova pagina (puoi specificare le dimensioni della pagina se necessario)
        const [page] = pdfDoc.getPages();
  
        // Crea un font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
        // Aggiungi il testo alla pagina
        page.drawText('Your text goes here', {
          x: 100,
          y: 500,
          size: 10,
          font,
          color: rgb(0, 0, 0), 
        });
  
        // Crea un nuovo file con il testo aggiunto
        const pdfBytes = await pdfDoc.save();
  
        // Converti i byte del PDF in un oggetto Blob
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
        // Crea un URL oggetto per il blob
        const url = URL.createObjectURL(blob);
  
        // Crea un link per scaricare il PDF con il testo aggiunto
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modified.pdf';
        a.textContent = 'Download modified PDF';
  
        // Aggiungi il link alla pagina
        document.body.appendChild(a);
      }

  return (
    <>
      {/*<button onClick={addTextToPDF}>Get Pdf</button>*/}
      <button>{t('getPdf')}</button>
    </>
  );
}

export default GetPdf;
