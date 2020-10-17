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
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const flowerCount = realtimeDB.ref('flowers_count');
  //   flowerCount.on('value', (snapshot) => {
  //     console.log('Realtime Database Update: ' + snapshot.val());
  //     setFlowerCount(snapshot.val());
  //   });

  //   return () => {
  //     flowerCount.off();
  //   };
  // }, []);

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

    checkIns.once('value', () => {
      setLoading(false);
    });

    return () => {
      checkIns.off();
    };
  }, []);

  return (
    <Switch>
      <Route path="/">
        <BalfurModal user={user} />
        <BalfurWrapper>
          <picture>
            <source srcSet="/images/balfur-eran-menashri-small.jpg" />
            <source media="(min-width: 800px)" type="image/webp" srcSet="/images/balfur-eran-menashri.webp 1x" />
            <BalfurHero src="/images/balfur-eran-menashri.jpg" alt="" />
          </picture>

          {/* {loading ? (
            <div style={{ textAlign: 'center' }}>
              <LoadingIcon src="/icons/loading-spinner.svg" alt="" />
              <p>טוענים את המהפכה..</p>
            </div>
          ) : (
            <div>
              492 ביצעו צ'ק אין בבלפור
              <BalfurCheckIns checkIns={checkIns} />
            </div>
          )} */}
        </BalfurWrapper>
      </Route>
    </Switch>
  );
}

const BalfurWrapper = styled.div``;

const BalfurHero = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
`;

const LoadingIcon = styled.img`
  display: flex;
  margin: 40px auto;
`;
