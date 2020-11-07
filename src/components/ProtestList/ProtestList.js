import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
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
            <ProtestListHeader style={{ marginTop: 15 }}>
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
    overflow: auto;
  }

  @media (min-width: 1700px) {
    padding: 15px 5px;
  }
  scrollbar-color: #5f6ffa #dde0ff;
  scrollbar-width: thin;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #dde0ff;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #5f6ffa;
    border-radius: 10px;
  }
`;

const ProtestListHeader = styled.h2`
  margin: 5px 0;
  text-align: center;
  font-weight: 600;
`;

export default ProtestList;
