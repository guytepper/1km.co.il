import firebase, { firestore, realtimeDB } from '../../firebase';
import { setLocalStorage } from '../../localStorage';

export async function createCheckIn(checkInData) {
  const checkIn = realtimeDB.ref('24-10-20_check_ins').push();
  await checkIn.set({ ...checkInData, createdAt: firebase.database.ServerValue.TIMESTAMP });
  realtimeDB.ref('24-10-20_check_in_count').set(firebase.database.ServerValue.increment(1));
  setLocalStorage('24-10-20_check_in', true);
  return checkIn;
}

export function saveCheckInHistory() {}

export async function updateUserName({ userId, firstName, lastName = '' }) {
  const userRef = firestore.collection('users').doc(userId);

  const updatedUser = await userRef.update({ firstName, lastName });
  return updatedUser;
}
