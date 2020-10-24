import styled from 'styled-components/macro';

export const ProtestCardWrapper = styled.div`
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0px rgba(80, 80, 82, 0.16);
  /* cursor: pointer; */
`;

export const ProtestCardTitle = styled.h2`
  margin: 0;
  margin-bottom: 7.5px;
  font-size: 22px;
  font-weight: 600;
`;

export const ProtestCardInfo = styled.div`
  margin-bottom: 7.5px;
`;

export const ProtestCardDetail = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 100;
  margin-bottom: 5px;
`;

export const ProtestCardIcon = styled.img`
  width: 17.5px;
  margin-inline-end: 5px;
  user-select: none;
`;

export const ProtestCardGroupButton = styled.a`
  display: block;
  max-width: 100%;
  margin: 10px 0;
  padding: 4px 16px;
  background: ${(props) => (props.type ? (props.type === 'whatsapp' ? '#00c647' : '#6AB2E4') : 'blue')};
  color: #fff;
  font-family: Simpler, sans-serif;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 3px;
`;
