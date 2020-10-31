import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import styled from 'styled-components/macro';
import { Upload, Input, Button, Modal, Typography } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import ProtestSelection from '../ProtestSelection';
import { Checkbox } from '../elements';
import { ReactComponent as GPSIcon } from '../../assets/icons/gps.svg';
import {
  uploadImage,
  fileToBase64,
  savePictureToFirestore,
  savePictureToLiveFeed,
  keepAnnonymousReference,
} from './UploadService';
import { getCurrentPosition } from '../../utils';
import queryString from 'query-string';

const { Title } = Typography;

function UploadForm({ afterUpload }) {
  const [currentFile, setCurrentFile] = useState(null);
  const [description, setDescription] = useState('');
  const [protestModalState, setProtestModalState] = useState(false);
  const [manualAddressSelection, setManualAddressSelection] = useState(false);
  const [loadingProtests, setLoadingProtests] = useState(false);
  const [isAnnonymous, setAnnonymous] = useState(false);
  const [uploading, setUploading] = useState(false);

  const store = useStore();
  const history = useHistory();

  const { protestStore, userStore } = store;

  const handleUpload = async () => {
    const { userCurrentProtest, user } = userStore;

    if (!userCurrentProtest) {
      alert('העלאה נכשלה: התמונה לא משוייכת להפגנה.');
      return;
    }

    if (!user) {
      alert('העלאה נכשלה: אינך מחובר/ת.');
      return;
    }

    setUploading(true);

    const result = await uploadImage(currentFile);
    if (!result) {
      alert('לא הצלחנו להעלות את התמונה.\nאם הבעיה ממשיכה להתרחש, אנא צרו איתנו קשר.');
      return;
    }

    const imageUrl = result.secure_url;
    const { id: protestId, displayName: protestName, cityName } = userCurrentProtest;
    const pictureData = { imageUrl, description, protestId, protestName, cityName };

    if (!isAnnonymous) {
      pictureData.userId = user.uid;
      pictureData.uploaderName = `${user.firstName || ''} ${user.lastName || ''}`;
      pictureData.userAvatar = user.pictureUrl || '';
    }

    const savedPicture = await savePictureToFirestore({ pictureData });

    if (isAnnonymous) {
      keepAnnonymousReference({ pictureId: savedPicture.id, userId: user.uid });
    }
    await savePictureToLiveFeed(pictureData);

    setUploading(false);

    Modal.success({
      title: 'התמונה הועלתה בהצלחה!',
      onOk: () => {
        const { returnUrl } = queryString.parse(window.location.search);
        if (returnUrl) {
          history.push(returnUrl);
        }
      },
    });
  };

  const openNearbyProtestsModal = async () => {
    try {
      const position = await getCurrentPosition();
      setManualAddressSelection(false);
      setLoadingProtests(true);
      store.setCoordinates(position);
      await protestStore.fetchProtests({ position, onlyMarkers: false });
      setProtestModalState(true);
      setLoadingProtests(false);
    } catch (err) {
      console.log(err);
      alert('לא הצלחנו לאתר את המיקום.\nניתן לבחור מיקום הפגנה ידנית :)');
    }
  };

  const setFile = async (file) => {
    const base64File = await fileToBase64(file);
    setCurrentFile(base64File);
    return false;
  };

  const handleProtestSelection = (protest) => {
    userStore.setUserProtest(protest);
    setProtestModalState(false);
  };

  return (
    <UploadFormWrapper>
      <UploadFormSection.Header style={{ textAlign: 'center', fontWeight: 600 }}>העלאת תמונה</UploadFormSection.Header>
      <UploadFormSection>
        <Upload showUploadList={false} beforeUpload={setFile} accept="image/*">
          <UploadButton icon={<PictureOutlined />}>{currentFile ? ' שינוי תמונה' : 'בחירת תמונה'}</UploadButton>
          <ImagePreview src={currentFile || '/images/picture-placeholder.svg'} alt="" />
        </Upload>
        <UploadFormSection>
          <Input onChange={(e) => setDescription(e.target.value)} placeholder="הוסיפו תיאור לתמונה..." />
        </UploadFormSection>
      </UploadFormSection>
      <UploadFormSection>
        <UploadFormSection.Header>
          <span style={{ color: 'red', marginLeft: 4 }}>*</span>שיוך תמונה להפגנה
        </UploadFormSection.Header>
        {userStore.userCurrentProtest ? (
          <Title level={3} style={{ textAlign: 'center' }}>
            {userStore.userCurrentProtest.displayName}
          </Title>
        ) : (
          <Button
            type="primary"
            size="large"
            style={{ width: '100%', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            icon={<GPSIcon width="16" height="16" />}
            loading={loadingProtests}
            onClick={() => openNearbyProtestsModal()}
          >
            <span style={{ marginRight: 7, marginBottom: 3 }}>מציאה לפי מיקום</span>
          </Button>
        )}
        <Button
          onClick={() => {
            setManualAddressSelection(true);
            setProtestModalState(true);
          }}
          size="large"
          style={{ width: '100%' }}
        >
          בחירת הפגנה ידנית
        </Button>
      </UploadFormSection>
      <label>
        <Checkbox onChange={(checked) => setAnnonymous(checked)}> העלאה אנונימית (שמכם לא יוצג באתר) </Checkbox>
      </label>
      <Button
        type="primary"
        size="large"
        icon={<UploadOutlined />}
        shape="round"
        onClick={handleUpload}
        disabled={!currentFile || !userStore.userCurrentProtest}
        loading={uploading}
        style={{ marginTop: 16, width: '100%' }}
        className="bg-success"
      >
        {uploading ? 'שולח תמונה..' : 'העלאת תמונה'}
      </Button>
      <Modal visible={protestModalState} onCancel={() => setProtestModalState(false)} footer={null} closable={false}>
        <ProtestSelection onProtestSelection={handleProtestSelection} manualAddress={manualAddressSelection} />
      </Modal>
    </UploadFormWrapper>
  );
}

export default observer(UploadForm);

const UploadFormWrapper = styled.div`
  width: 310px;
  margin: 0 auto;
  padding: 25px 10px;

  @media (min-width: 400px) {
    width: 400px;
  }
`;

const UploadFormSection = styled.div`
  margin-bottom: 10px;
`;

UploadFormSection.Header = styled.h3`
  font-size: 18px;
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
