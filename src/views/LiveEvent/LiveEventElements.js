import styled from 'styled-components/macro';

export const LiveEventWrapper = styled.div`
  /* background: #f4f6fa; */
`;

export const LiveEventHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid #e4e6eb;
  font-size: 12px;

  @media (min-width: 390px) {
    font-size: 13px;
  }

  @media (min-width: 410px) {
    font-size: 14px;
  }
`;

LiveEventHeader.Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  background: ${(props) => (props.selected ? '#6E7DFF' : '#f2f2f2')};
  color: ${(props) => (props.selected ? '#fff' : '#6E7DFF')};
  cursor: pointer;
`;

LiveEventHeader.Button.Icon = styled.img`
  width: 16px;
  margin-left: 6px;
  filter: ${(props) => props.invert && 'brightness(10)'};

  @media (min-width: 390px) {
    width: 17px;
  }

  @media (min-width: 410px) {
    width: 18px;
    margin-left: 7.5px;
  }
`;

export const LiveEventMessage = styled.h3`
  text-align: center;
`;
