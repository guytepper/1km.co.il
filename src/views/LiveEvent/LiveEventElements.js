import styled from 'styled-components/macro';
import { animated } from 'react-spring';

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

export const LiveCurrentView = styled.div`
  padding: 0 20px;
`;

export const CheckInListWrapper = styled.div`
  display: grid;
  grid-auto-rows: minmax(90px, max-content);
  height: 500px;
`;

export const CheckIn = styled(animated.div)`
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  min-width: 300px;
  align-items: center;
  margin-bottom: 14px;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0px 2px 5px -1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  @media (min-width: 600px) {
    max-width: 400px;
  }
`;

CheckIn.Avatar = styled.img`
  width: 36px;
  height: 36px;
  margin-left: 10px;
  margin-bottom: 5px;
  flex-shrink: 0;
  border-radius: 50px;
  user-select: none;
`;

CheckIn.Info = styled.div`
  display: flex;
  flex-direction: column;
`;

CheckIn.Name = styled.span`
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 2px;
`;

CheckIn.Location = styled.span`
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 4px;
`;

CheckIn.Comment = styled.span`
  font-size: 15px;
  font-weight: 100;
  margin-bottom: 4px;
`;
