import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';
import { fetchProtest, uploadFile } from '../api';
import { Map, TileLayer, Marker } from 'react-leaflet';
import S3 from 'react-aws-s3';

function useFetchProtest() {
  const [protest, setProtest] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function _fetchProtest(id) {
      const result = await fetchProtest(id);
      if (result) {
        setProtest(result);
      } else {
        // TODO: handle 404
      }
    }

    _fetchProtest(id);
  }, [id]);

  return protest;
}

function useFileUpload(directly = true) {
  const onFileUpload = (e, folderName) => {
    const selectedFile = e.target.files[0];

    if (directly) {
      // Upload directly from browser
      const config = {
        bucketName: '1km',
        dirName: `images/${folderName}`,
        region: 'eu-west-1',
        accessKeyId: '',
        secretAccessKey: '',
      };

      const ReactS3Client = new S3(config);

      ReactS3Client.uploadFile(selectedFile, selectedFile.name.split('.')[0])
        .then((data) => {
          // TODO: update s3 url in firebase
          console.log(data);
        })
        .catch((err) => console.error(err));
    } else {
      const formData = new FormData();
      formData.append('image', selectedFile);

      uploadFile(formData);
    }
  };

  return { onFileUpload };
}

export default function ProtestPage() {
  const protest = useFetchProtest();
  const { onFileUpload } = useFileUpload(false);

  if (!protest) {
    // TODO: loading state
    return <div>Loading...</div>;
  }

  const { coordinates, whatsAppLink, telegramLink } = protest;

  return (
    <Container>
      <h2>{protest.displayName}</h2>
      <p>
        {protest.streetAddress} - יום שבת, {protest.meeting_time}
      </p>
      {whatsAppLink && (
        <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">
          <Icon src="/icons/whatsapp.svg" alt="whatsapp link" />
        </a>
      )}

      {telegramLink && (
        <a href={telegramLink} target="_blank" rel="noopener noreferrer">
          <Icon src="/icons/telegram.svg" alt="telegram link" />
        </a>
      )}

      <MapWrapper center={{ lat: coordinates.latitude, lng: coordinates.longitude }} zoom={14}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={{ lat: coordinates.latitude, lng: coordinates.longitude }}></Marker>
      </MapWrapper>

      <form>
        <label>
          <input type="file" onChange={(e) => onFileUpload(e, protest.displayName)} />
          <span>Upload Image</span>
        </label>
      </form>
    </Container>
  );
}

//----------------- Styles -------------------------//

const Container = styled.div`
  width: 80%;
  max-width: 1000px;
  padding: 24px 0;
  margin: 0 auto;
`;

const MapWrapper = styled(Map)`
  height: 250px;
  width: 250px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;
