import { useState } from 'react'
import xml2js from 'xml2js'

import './UploadFile.css';
import { useTranslation } from 'react-i18next';

const UploadFile = ({updateFileToUpload }) => {

  const [filePreview, setFilePreview] = useState(null);

  const { t } = useTranslation();
    
  const selectFileHandler = () => {
    let fileUpload = document.getElementById('selectFile');
    fileUpload.click();
    fileUpload.onchange = () => handleFileUpload(fileUpload.files);
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
  };

  const dropHandler = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    const fileReader = new FileReader();
    setFilePreview(files[0].name);
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = e => {
      const file = e.target.result;
      // I controlli sul file possono anche essere fatti qui ma bisogna prima verificare quale file si sta caricando
      updateFileToUpload(file);
    };
  }

  return (
    <>
      <div id="drop_file_zone">
        <input type="file" id="selectFile" accept=".xml"/>
        <div id="drag_upload_file" onDragOver={dragOverHandler} onDrop={dropHandler} onClick={selectFileHandler}>
          { filePreview ? (
            <span className='filePreview'>
              {filePreview}
            </span>
          ):(
            <span className="roboto-regular">
              {t('uploadFileInfo')}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
  
export default UploadFile;