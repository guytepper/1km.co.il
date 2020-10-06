/**
 * This is a temporary screen for admin to add whatsapp groups to a protest.
 * The URLs are currently stored in a google form spreadsheet, so it has to be copied to the database using this form.
 * Once we'll deal with the work overload we can work on adding a protest directly to the database.s
 */

import React, { useEffect, useState } from 'react';
import { Button } from '../components';
import { useAuth } from '../hooks';
import firebase, { firestore, signInWithGoogle } from '../firebase';
import styled from 'styled-components/macro';
import API from '../api';

async function getProtestByDisplayName(displayName) {
  try {
    const snapshot = await firestore.collection('protests').where('displayName', '==', displayName).limit(5).get();
    const protests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return protests;
  } catch (err) {
    console.log(err);
  }
}

async function updateProtestWhatsAppGroup(protestId, whatsAppLink) {
  try {
    const request = await firestore.collection('protests').doc(protestId).update({
      whatsAppLink,
    });
    if (request === undefined) alert('הקישור עודכן');
    else throw request;
  } catch (err) {
    console.error(err);
    alert('An error occured. Check the console.');
  }
}

export default function GroupUpdate() {
  const authUser = useAuth();
  const [protestName, setProtestName] = useState('');
  const [selectedProtest, setProtest] = useState('');
  const [protests, setProtests] = useState([]);
  const [updatedLink, setLink] = useState('');

  const getProtest = () => {
    getProtestByDisplayName(protestName).then((result) => setProtests(result));
  };

  useEffect(() => {
    setLink(selectedProtest.whatsAppLink);
  }, [selectedProtest]);

  return (
    <AdminWrapper>
      {authUser ? (
        <div>
          <label>
            שם ההפגנה
            <br />
            <input
              value={protestName}
              onChange={(e) => setProtestName(e.target.value)}
              style={{ width: '100%', height: 40 }}
            ></input>
            <br />
            <Button onClick={getProtest} style={{ width: '100%' }}>
              חיפוש
            </Button>
            <ul>
              {protests.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setProtest(p)}
                  style={{ fontWeight: p.id === selectedProtest.id ? 'bold' : 'regular' }}
                >
                  {p.displayName}, {p.streetAddress}
                </li>
              ))}
            </ul>
            <br />
            <input
              style={{ width: '100%', height: 40 }}
              value={updatedLink}
              onChange={(e) => setLink(e.target.value)}
              placeholder="לינק  הקבוצה"
            ></input>
            <br />
            <Button
              onClick={() => updateProtestWhatsAppGroup(selectedProtest.id, updatedLink)}
              style={{ width: '100%' }}
              color="green"
            >
              עדכון הפגנה
            </Button>
          </label>
        </div>
      ) : (
        '🙈'
      )}
    </AdminWrapper>
  );
}

const AdminWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  padding: 20px;
`;
