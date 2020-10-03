import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProtestCard from '../ProtestCard';

function ProtestListItems({ protests, listTitle }) {
  if (protests.length > 0) {
    return (
      <>
        <ProtestListHeader>{listTitle}</ProtestListHeader>
        {protests.slice(0, 10).map((protest) => (
          <ProtestCard key={protest.id} protestInfo={protest} />
        ))}
      </>
    );
  }

  return null;
}

function ProtestList({ loading, closeProtests, farProtests }) {
  const wrapper = useRef(null);

  useEffect(() => {
    wrapper.current.scrollTop = 0;
  }, [closeProtests]);

  return (
    <ProtestListWrapper ref={wrapper}>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <>
          {closeProtests.length === 0 ? (
            <ProtestListHeader>
              לא נמצאו הפגנות ברדיוס של קילומטר ממך.
              <br />
              <Link to="/add-protest/">הוסיפו את ההפגנה הראשונה!</Link>
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
  padding: 0 0 15px;

  @media (min-width: 768px) {
    max-height: 100vh;
    overflow: scroll;
  }

  @media (min-width: 1700px) {
    padding: 15px 5px;
  }
`;

const ProtestListHeader = styled.h2`
  margin: 15px 0 0;
  text-align: center;
  font-weight: 600;
`;

export default ProtestList;
