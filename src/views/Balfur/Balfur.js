import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Button } from '../../components';
import firebase, { realtimeDB } from '../../firebase';
import styled from 'styled-components/macro';
import BalfurStage from '../../components/BalfurStage';
import { BalfurModal, BalfurCheckIns, BalfurPictures } from './';
import { isVisitor } from '../../utils';
import ProgressBar from './ProgressBar';

export default function Balfur({ user }) {
  const history = useHistory();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInsCount, setCheckInsCount] = useState(-1);
  const [maxCheckInCount, setMaxCheckInCount] = useState(-1);

  const delayRowsApear = 1500;
  const numberOfRowsToSlide = 6;

  useEffect(() => {
    var timeout = 1;
    const checkIns = realtimeDB.ref('balfur_check_ins').orderByChild('createdAt').limitToLast(10);
    checkIns.on('child_added', (data) => {
      const { firstName, userMessage, picture_url, createdAt } = data.val();
      setTimeout(() => {
        setCheckIns((prevState) => {
          /* Set display to none, after animation the row wil be shown */
          return [{ firstName, userMessage, picture_url, createdAt, display: 'none' }, ...prevState];
        });
      }, timeout);
      /*Make first 6 rows appear with 1sec delay 
      after 6 secondes timeout=0*/
      timeout = timeout >= numberOfRowsToSlide * delayRowsApear ? 0 : timeout != 0 ? timeout + delayRowsApear : 0;
    });

    realtimeDB.ref('balfur_count').on('value', (snapshot) => {
      setCheckInsCount(snapshot.val());
    });
    realtimeDB.ref('max_checkIn').on('value', (snapshot) => {
      setMaxCheckInCount(snapshot.val());
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
          <ProgressBar checkInsCount={checkInsCount} MaxCheckIns={maxCheckInCount} />
          <picture>
            <source media="(max-width: 800px)" srcSet="/images/balfur-eran-menashri-small.jpg" />
            <source media="(min-width: 800px)" type="image/webp" srcSet="/images/balfur-eran-menashri.webp 1x" />
            <EventHero src="/images/balfur-eran-menashri.jpg" alt="" />
          </picture>
          <EventContentWrapper>
            <EventBox>
              <EventBoxTitleWrapper>
                <EventBoxTitle>מי בבלפור?</EventBoxTitle>
                <BalfurCheckIns checkIns={checkIns} setCheckIns={setCheckIns} />
              </EventBoxTitleWrapper>
            </EventBox>
            <EventBox>
              <EventBoxTitleWrapper>
                <EventBoxTitle>תמונות מהשטח</EventBoxTitle>
                <BalfurPictures />
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

  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 0 30px;
  }
`;

const EventBox = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-top: 30px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 10px -1px;
  z-index: 20;

  &:first-of-type {
    margin-top: -60px;
  }
`;

const EventBoxTitleWrapper = styled.div``;
const EventBoxTitle = styled.div`
  position: relative;
  padding: 15px 19px;
  font-size: 21px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
`;

const LoadingIcon = styled.img`
  display: flex;
  margin: 40px auto;
`;
