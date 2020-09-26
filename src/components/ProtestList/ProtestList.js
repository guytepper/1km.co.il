import React from 'react';
import styled from 'styled-components';
import ProtestCard from '../ProtestCard';

function ProtestListItems({ protests, listTitle }) {
  if (protests.length > 0) {
    return (
      <>
        <ProtestListHeader>{listTitle}</ProtestListHeader>
        {protests.map((protest) => (
          <ProtestCard key={protest.id} protestInfo={protest} />
        ))}
      </>
    );
  }

  return null;
}

function ProtestList({ loading, closeProtests, farProtests }) {
  return (
    <ProtestListWrapper>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <>
          {closeProtests.length === 0 ? (
            <ProtestListHeader>
              לא נמצאו הפגנות ברדיוס של קילומטר ממך.
              <br />
              <a href="https://forms.gle/oFXS1qQtY2FyYbLA6" target="blank">
                הוסיפו את ההפגנה הראשונה!
              </a>
            </ProtestListHeader>
          ) : (
            <ProtestListItems protests={closeProtests} listTitle={'עד קילומטר אחד ממך'} />
          )}
          <ProtestListItems protests={farProtests} listTitle={'קצת יותר רחוק'} />
        </>
      )}
    </ProtestListWrapper>
  );
}

const ProtestListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  gap: 15px;
  padding: 15px;
`;

const ProtestListHeader = styled.h2`
  margin-bottom: 0;
  font-weight: 600;
`;

export default ProtestList;
