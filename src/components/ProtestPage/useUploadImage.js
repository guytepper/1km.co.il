import S3 from 'react-aws-s3';
import { uploadFile } from '../api';

export function useFileUpload(directly = true) {
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
