import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Button } from '../../components';
import firebase, { realtimeDB } from '../../firebase';
import styled from 'styled-components/macro';
import BalfurStage from '../../components/BalfurStage';
import { BalfurModal, BalfurCheckIns } from './';

export default function Balfur({ user }) {
  const history = useHistory();
  const [flowerCount, setFlowerCount] = useState(1);
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    const flowerCount = realtimeDB.ref('flowers_count');
    flowerCount.on('value', (snapshot) => {
      console.log('Realtime Database Update: ' + snapshot.val());
      setFlowerCount(snapshot.val());
    });

    return () => {
      flowerCount.off();
    };
  }, []);

  useEffect(() => {
    const checkIns = realtimeDB.ref('balfur_check_ins').orderByChild('createdAt').limitToLast(15);
    checkIns.on('child_added', (data) => {
      const { firstName, userMessage, profilePic, createdAt } = data.val();
      setCheckIns((prevState) => {
        return [{ firstName, userMessage, profilePic, createdAt }, ...prevState];
      });
      // addCommentElement(postElement, data.key, data.val().text, data.val().author);
      console.log(data.val());
    });

    return () => {
      checkIns.off();
    };
  }, []);

  const addFlower = () => {
    realtimeDB.ref('flowers_count').set(firebase.database.ServerValue.increment(1));
  };

  return (
    <Switch>
      <Route path="/">
        <BalfurWrapper>
          <BalfurCheckIns checkIns={checkIns} />

          <Route path="/balfur/flower-modal">
            <BalfurModal user={user} />
          </Route>
        </BalfurWrapper>
      </Route>
    </Switch>
  );
}

const BalfurWrapper = styled.div``;
