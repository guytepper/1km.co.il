import React from 'react';
import styled from 'styled-components/macro';

function ProtestListSelection({ protests, setProtest }) {
  console.log('Protest length: ', protests.length);
  return (
    <ProtestSelectionWrapper>
      <ProtestSelectionList>
        {protests.length > 0 &&
          protests.map((protest) => {
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
