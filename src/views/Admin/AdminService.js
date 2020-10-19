import { firestore } from '../../firebase';
import * as API from '../../api';

/**
 * Add a new protest to the map and archive the pending one.
 * @param {*} params - The new protest parameters.
 * @param {*} pendingProtestId - The pending protest id.
 */
const createProtest = async (params, protestId) => {
  try {
    const a = await API.createProtest(params, true);
    const b = await API.archivePendingProtest(protestId);
    if (a === undefined && b === true) {
      return true;
    }
    return a;
  } catch (err) {
    alert('An error occured; check the console');
    console.error(err);
  }
};

export async function fetchPendingProtests() {
  const snapshot = await firestore
    .collection('pending_protests')
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

export async function updateProtest({ protestId, params, updateCallback }) {
  try {
    const updated = await API.updateProtest(protestId, params);
    if (updated && updateCallback) {
      updateCallback(updated);
    }
    return updated;
  } catch (err) {
    alert('An error occured; check the console');
    console.error(err);
  }
}

export async function archiveProtest({ protestId, type, archiveCallback }) {
  try {
    let archived;
    if (type === 'pending') {
      archived = await API.archivePendingProtest(protestId);
    } else {
      archived = await API.archiveProtest(protestId);
    }
    if (archived) {
      archiveCallback(archived);
    } else {
      alert(archived);
    }
  } catch (err) {
    alert('An error occured; check the console');
    console.error(err);
  }
}

export async function submitProtest({ params, protestId, submitCallback }) {
  const result = await createProtest(params, protestId);
  if (result) {
    submitCallback(result);
  }
}
