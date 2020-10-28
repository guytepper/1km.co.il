import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components/macro';
import { Upload, Button } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import { Checkbox } from '../elements';
import { ReactComponent as GPSIcon } from '../../assets/icons/gps.svg';
import { uploadImage, fileToBase64 } from './UploadService';

function UploadForm({ afterUpload }) {
  const [currentFile, setCurrentFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    const result = await uploadImage(currentFile);
    setUploading(false);
    afterUpload(result);
  };

  const setFile = async (file) => {
    const base64File = await fileToBase64(file);
    setCurrentFile(base64File);
  };

  return (
    <UploadFormWrapper>
      <UploadFormSection.Header style={{ textAlign: 'center', fontWeight: 600 }}>העלאת תמונה</UploadFormSection.Header>
      <UploadFormSection>
        <Upload showUploadList={false} beforeUpload={setFile}>
          <UploadButton icon={<PictureOutlined />}>{currentFile ? ' שינוי תמונה' : 'בחירת תמונה'}</UploadButton>
          <ImagePreview src={currentFile || '/images/picture-placeholder.svg'} alt="" />
        </Upload>
      </UploadFormSection>
      <UploadFormSection>
        <UploadFormSection.Header>שיוך תמונה להפגנה</UploadFormSection.Header>
        <p>נמצאים בהפגנה עכשיו? לחצו על הכפתור ונאתר את ההפגנה אוטומטית. </p>
        <Button
          type="primary"
          size="large"
          style={{ width: '100%', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          icon={<GPSIcon width="16" height="16" />}
        >
          <span style={{ marginRight: 7, marginBottom: 3 }}>מציאה אוטומטית לפי מיקום</span>
        </Button>
        <Button size="large" style={{ width: '100%' }}>
          <span style={{ marginRight: 7, marginBottom: 3 }}>בחירה ידנית</span>
        </Button>
      </UploadFormSection>
      <label>
        <Checkbox> העלאה אנונימית (שמכם לא יוצג באתר) </Checkbox>
      </label>
      <Button
        type="primary"
        size="large"
        icon={<UploadOutlined />}
        shape="round"
        onClick={handleUpload}
        disabled={!currentFile}
        loading={uploading}
        style={{ marginTop: 16, width: '100%' }}
        className="bg-success"
      >
        {uploading ? 'שולח תמונה..' : 'העלאת תמונה'}
      </Button>
    </UploadFormWrapper>
  );
}

export default observer(UploadForm);

const UploadFormWrapper = styled.div`
  max-width: 375px;
  margin: 0 auto;
  padding: 10px;
`;

const UploadFormSection = styled.div`
  margin-bottom: 10px;
`;

UploadFormSection.Header = styled.h3`
  font-size: 22px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 280px;
  margin-bottom: 10px;
  object-fit: contain;
  background-color: #e1e2e2;
  border: 1px solid #9c9c9c;
`;

const UploadButton = styled(Button)`
  display: block !important;
  width: 100%;
  height: 50px;
  font-size: 18px;
  margin-bottom: 10px;
`;
