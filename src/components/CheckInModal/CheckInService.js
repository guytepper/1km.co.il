import firebase, { firestore, realtimeDB } from '../../firebase';
import { setLocalStorage, getLocalStorage } from '../../localStorage';

export async function createCheckIn({ picture_url, firstName, userMessage }) {
  setLocalStorage('24-10-20_check_in', true);
  const checkIn = realtimeDB.ref('24-10-20_check_ins').push();
  await checkIn.set({ picture_url, firstName, userMessage, createdAt: firebase.database.ServerValue.TIMESTAMP });
  realtimeDB.ref('24-10-20_check_in_count').set(firebase.database.ServerValue.increment(1));
  return checkIn;
}

export function saveCheckInHistory() {}

export async function updateUserFirstName({ userId, firstName }) {
  const userRef = firestore.collection('users').doc(userId);
  const updatedUser = await userRef.update({ first_name: firstName });
  return updatedUser;
}
