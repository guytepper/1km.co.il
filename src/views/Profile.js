import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';

function MyProtests({ protests }) {
  return <>
  <h1>my protests</h1>
    <ul>
      {protests.map(protest => {
        return <li key={protest.id}>{protest.displayName}</li>
      })}
    </ul>
  </>;
}

export default function Profile(props) {
  const [myProtests, setMyProtests] = useState(null);

  useEffect(() => {
    if (!props.user) {
      return;
    }

    var protestsRef = firestore.collection('protests');
    var query = protestsRef.where('roles.leader', 'array-contains', props.user.uid);
  
    query.get()
    .then(function(querySnapshot) {
      const protests = [];

      querySnapshot.forEach(function(doc) {
        protests.push({ id: doc.id, ...doc.data() });
      });

      setMyProtests(protests);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  }, [props.user]);

  if(!props.user) {
    return null;
  }

  console.log(props.user);
  return <>
    <h2>Hey {props.user.displayName}!</h2>
    {myProtests ? <MyProtests protests={myProtests} /> : null}
  </>;
}
