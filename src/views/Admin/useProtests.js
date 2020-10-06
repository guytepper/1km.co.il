import { useEffect, useState } from 'react';
import { firestore } from '../../firebase';

async function fetchProtests(type) {
  if (!['pending', 'approved'].includes(type)) {
    throw new Error('Wrong type');
  }

  const protestType = type === 'approved' ? '' : 'pending_';

  const snapshot = await firestore
    .collection(`${protestType}protests`)
    .where('archived', '!=', true)
    .orderBy('archived')
    .orderBy('created_at', 'desc')
    .limit(50)
    .get();
  const protests = snapshot.docs.map((doc) => {
    const { latitude, longitude } = doc.data().g.geopoint;
    const protestLatlng = [latitude, longitude];
    return {
      id: doc.id,
      latlng: protestLatlng,
      ...doc.data(),
    };
  });
  return protests;
}

const useProtests = () => {
  const [pendingProtests, setPendingProtests] = useState([]);
  const [approvedProtests, setApprovedProtests] = useState([]);

  useEffect(() => {
    async function fetchPendingProtests() {
      const protests = await fetchProtests('pending');
      setPendingProtests(protests);
    }

    async function fetchApprovedProtests() {
      const protests = await fetchProtests('approved');
      setApprovedProtests(protests);
    }

    fetchPendingProtests();
    fetchApprovedProtests();
  }, []);

  return { pendingProtests, approvedProtests };
};

export default useProtests;
