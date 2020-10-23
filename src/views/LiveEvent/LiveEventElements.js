import styled from 'styled-components/macro';

export const LiveEventWrapper = styled.div`
  /* background: #f4f6fa; */
`;

export const LiveEventHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid #e4e6eb;
  font-size: 12px;
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
`;
