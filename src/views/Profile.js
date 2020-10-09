import React, { useEffect, useState } from 'react';
import { getProtestsForLeader } from '../api';

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

    getProtestsForLeader(props.user.uid).then(protests => {
      setMyProtests(protests);
    });
  }, [props.user]);

  if (!props.user) {
    return null;
  }

  return <>
    <h2>Hey {props.user.displayName}!</h2>
    {myProtests ? <MyProtests protests={myProtests} /> : null}
  </>;
}
