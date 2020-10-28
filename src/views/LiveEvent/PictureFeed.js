import React from 'react';
import { UploadForm } from '../../components';
import { savePictureToFirestore } from '../../components/UploadForm/UploadService';

function PictureFeed() {
  const afterUpload = (file) => {
    console.log(file);
  };

  return <UploadForm afterUpload={afterUpload} />;
}

export default PictureFeed;
