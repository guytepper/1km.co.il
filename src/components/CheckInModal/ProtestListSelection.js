import React, { useState, useEffect } from 'react';
import { Button } from '../elements';
import styled from 'styled-components/macro';

const protestsDev = [
  {
    id: 'Uq77wuPjqfFJo58ytDDw',
    distance: 324,
    dateTimeList: [{ time: '17:30', id: 0, date: '2020-10-24' }],
    meeting_time: '18:00',
    coordinates: { latitude: 31.767174, longitude: 35.204461 },
    coords: [31.767174, 35.204461],
    created_at: { seconds: 1601312938, nanoseconds: 469000000 },
    notes: '',
    displayName: 'צומת ניות',
    streetAddress: 'ירושלים',
    telegramLink: '',
    g: { geopoint: { latitude: 31.767174, longitude: 35.204461 }, geohash: 'sv9h9p515q' },
    whatsAppLink: 'https://chat.whatsapp.com/GDHnQLp4tuq8qnuxBABykl',
  },
  {
    id: 'LAIIFaOgF8GqkZ6eA0kZ',
    distance: 374,
    created_at: { seconds: 1601645528, nanoseconds: 201000000 },
    notes: '',
    coordinates: { latitude: 31.766989040413794, longitude: 35.2101670531556 },
    whatsAppLink: 'https://chat.whatsapp.com/LIsCB5hEGH1BDkpGsx2pxs',
    g: { geopoint: { latitude: 31.766989040413794, longitude: 35.2101670531556 }, geohash: 'sv9h9pp207' },
    displayName: 'פלמ״ח פינת כובשי קטמון ',
    telegramLink: '',
    meeting_time: '19:15',
    streetAddress: 'ירושלים',
  },
  {
    id: '7m0PLBSljjcYKe5KUWsP',
    distance: 915,
    meeting_time: '18:00',
    coordinates: { latitude: 31.759379105499427, longitude: 35.20052026149571 },
    g: { geohash: 'sv9h9j85z9', geopoint: { latitude: 31.759379105499427, longitude: 35.20052026149571 } },
    streetAddress: 'בית הנוער העברי, הרב הרצוג, ירושלים',
    telegramLink: '',
    notes: '',
    displayName: 'בית הנוער העברי',
    created_at: { seconds: 1601736747, nanoseconds: 698000000 },
    whatsAppLink: 'https://chat.whatsapp.com/LqFo3MS9YI5L46iZPHKMEz',
  },
  {
    id: '2nuEMRjHLEhlh3QmWDhQ',
    distance: 931,
    whatsAppLink: 'https://chat.whatsapp.com/GDHnQLp4tuq8qnuxBABykl',
    telegramLink: '',
    streetAddress: 'ירושלים',
    displayName: 'צומת מוזיאון ישראל',
    meeting_time: '18:00',
    created_at: { seconds: 1601472260, nanoseconds: 306000000 },
    notes: 'מול הכנסת',
    coordinates: { latitude: 31.775105, longitude: 35.204111 },
    g: { geohash: 'sv9hc06z7h', geopoint: { latitude: 31.775105, longitude: 35.204111 } },
  },
];

function ProtestListSelection({ protests, setProtest }) {
  return (
    <ProtestSelectionWrapper>
      <h3>איפה אתם מפגינים?</h3>

      <ProtestSelectionList>
        {protestsDev?.map((protest) => {
          return (
            <ProtestSelectionCard onClick={() => setProtest(protest)} key={protest.id} tabIndex={0}>
              <ProtestSelectionCard.Details>
                <ProtestSelectionCard.Title>{protest.displayName}</ProtestSelectionCard.Title>
                <ProtestSelectionCard.Address>{protest.streetAddress}</ProtestSelectionCard.Address>
              </ProtestSelectionCard.Details>
            </ProtestSelectionCard>
          );
        })}
      </ProtestSelectionList>
      <div>
        <p style={{ margin: '0 auto 10px' }}>
          ההפגנה לא ברשימה?
          <br />
          נסו לעדכן מיקום או הוסיפו הפגנה חסרה
        </p>
        <Button style={{ width: '100%' }}>עדכון מיקום</Button>
        <Button style={{ width: '100%' }}>הוספת הפגנה</Button>
      </div>
    </ProtestSelectionWrapper>
  );
}

export default ProtestListSelection;

const ProtestSelectionWrapper = styled.div`
  width: 100%;
`;

const ProtestSelectionList = styled.div`
  /* margin: 0 -40px; */
`;

const ProtestSelectionCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  margin-bottom: 10px;
  text-align: center;
  background: #1ed96e;
  color: #fff;
  cursor: pointer;
`;

ProtestSelectionCard.Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

ProtestSelectionCard.Title = styled.span`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
`;
ProtestSelectionCard.Address = styled.span`
  margin: 0;
  font-size: 14px;
`;
