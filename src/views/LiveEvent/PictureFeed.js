import React from 'react';
import { UploadForm } from '../../components';
import { savePictureToFirestore } from '../../components/UploadForm/UploadService';

function PictureFeed() {
  const afterUpload = async (file) => {
    const imageUrl = file.secure_url;
    await savePictureToFirestore({ imageUrl, protestId: 'UqcAWCguyNFtgqECTowe', userId: '123' });
  };

  return <UploadForm afterUpload={afterUpload} />;
}

export default PictureFeed;
