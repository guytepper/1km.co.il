import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { realtimeDB } from '../../firebase';
import styled from 'styled-components/macro';
import { BalfurModal, BalfurCheckIns } from './';
import { ProgressBar, SimpleProgress } from './ProgressBar';

export default function Balfur({ user, setUser }) {
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
      timeout = timeout >= numberOfRowsToSlide * delayRowsApear ? 0 : timeout !== 0 ? timeout + delayRowsApear : 0;
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
    <>
      {history.location.pathname === '/balfur' && <BalfurModal user={user} setUser={setUser} />}
      <EventWrapper>
        <picture>
          <source media="(max-width: 800px)" srcSet="/images/balfur-eran-menashri-small.jpg" />
          <source media="(min-width: 800px)" type="image/webp" srcSet="/images/balfur-eran-menashri.webp 1x" />
          <EventHero src="/images/balfur-eran-menashri.jpg" alt="" />
        </picture>
        <ProgressBar checkInsCount={checkInsCount} MaxCheckIns={maxCheckInCount} />
        <EventContentWrapper>
          <EventBox>
            <EventBoxTitleWrapper>
              <EventBoxTitle>מי בבלפור?</EventBoxTitle>
              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <LoadingIcon src="/icons/loading-spinner.svg" alt="" />
                  <p>טוענים את המהפכה..</p>
                </div>
              ) : (
                <BalfurCheckIns checkIns={checkIns} setCheckIns={setCheckIns} />
              )}
            </EventBoxTitleWrapper>
          </EventBox>
          <EventBox>
            <EventBoxTitleWrapper>
              <EventBoxTitle>מדד העצבים של ביבי</EventBoxTitle>
              {loading || checkInsCount === -1 ? (
                <div style={{ textAlign: 'center' }}>
                  <LoadingIcon src="/icons/loading-spinner.svg" alt="" />
                  <p>טוענים את המהפכה..</p>
                </div>
              ) : (
                <div>
                  <h2 style={{ textAlign: 'center ', marginBottom: 0 }}>{checkInsCount}</h2>
                  <h2 style={{ textAlign: 'center', margin: 0 }}>מפגינים באתר</h2>
                  <SimpleProgress checkInsCount={checkInsCount} MaxCheckIns={maxCheckInCount} />
                </div>
              )}
            </EventBoxTitleWrapper>
          </EventBox>
        </EventContentWrapper>
      </EventWrapper>
    </>
  );
}

const EventWrapper = styled.div``;

const EventHero = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  position: relative;
  z-index: 10;

  @media (min-width: 600px) {
    height: 340px;
    object-position: 0px -140px;
  }
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
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 10px -1px;
  z-index: 20;

  &:first-of-type {
    margin-top: -60px;
  }

  &:last-of-type {
    display: none;
  }

  @media (min-width: 600px) {
    margin-top: -60px;

    &:last-of-type {
      display: block;
    }
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
