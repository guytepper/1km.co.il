import React, { useEffect, useState } from 'react';
import { PageWrapper, ProtestCard } from '../components';
import { getProtestsForLeader } from '../api';

function MyProtests({ protests }) {
  return (
    <ul>
      {protests.map((protest) => {
        return (
          <ProtestCard key={protest.id} protestInfo={protest}>
            {protest.displayName}
          </ProtestCard>
        );
      })}
    </ul>
  );
}

export default function Profile(props) {
  const [myProtests, setMyProtests] = useState(null);

  useEffect(() => {
    if (!props.user) {
      return;
    }

    getProtestsForLeader(props.user.uid).then((protests) => {
      setMyProtests(protests);
    });
  }, [props.user]);

  if (!props.user) {
    return null;
  }

  return (
    <PageWrapper>
      <h2>הפגנות מורשות לעדכון</h2>
      <div>כאן תוכלו לראות את ההפגנות שחשבונכן רשאי לעדכן. </div>
      {myProtests ? <MyProtests protests={myProtests} /> : null}
    </PageWrapper>
  );
}
