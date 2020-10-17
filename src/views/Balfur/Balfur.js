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
        <EventWrapper>
          <picture>
            <source media="(max-width: 800px)" srcSet="/images/balfur-eran-menashri-small.jpg" />
            <source media="(min-width: 800px)" type="image/webp" srcSet="/images/balfur-eran-menashri.webp 1x" />
            <EventHero src="/images/balfur-eran-menashri.jpg" alt="" />
          </picture>
          <EventContentWrapper>
            <EventBox>
              <EventBoxTitleWrapper>
                <EventBoxTitle>מי בבלפור?</EventBoxTitle>
              </EventBoxTitleWrapper>
            </EventBox>
          </EventContentWrapper>

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
        </EventWrapper>
      </Route>
    </Switch>
  );
}

const EventWrapper = styled.div``;

const EventHero = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  position: relative;
  z-index: 10;
`;

const EventContentWrapper = styled.div`
  padding: 0 15px;
`;

const EventBox = styled.div`
  width: 100%;
  height: 300px;
  margin-top: -60px;
  background-color: red;
  position: relative;
  z-index: 20;
`;

const EventBoxTitleWrapper = styled.div``;
const EventBoxTitle = styled.div``;

const LoadingIcon = styled.img`
  display: flex;
  margin: 40px auto;
`;
