import styled from 'styled-components/macro';
import { animated } from 'react-spring';

export const LiveEventWrapper = styled.div`
  @media (min-width: 600px) {
    width: 600px;
    margin: 0 auto;
  }
`;

export const LiveEventHeader = styled.div`
  /* position: sticky;
  top: 60px; */
  display: grid;
  /* grid-template-columns: repeat(3, 1fr); */
  grid-template-columns: 1fr;
  box-shadow: 0 0 0px 1px #e4e6eb;
  font-size: 12px;
  z-index: 2;

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
  padding: 20px;
`;

export const CheckInListWrapper = styled.div`
  display: grid;
  grid-auto-rows: minmax(min-content, max-content);
  justify-content: center;
  height: 500px;
`;

export const CheckIn = styled(animated.div)`
  display: grid;
  grid-template-columns: 60px 1fr 80px;
  grid-template-rows: auto auto;
  align-items: center;
  min-width: 320px;
  margin-bottom: 14px;
  padding: 12.5px 15px;
  background: #fff;
  box-shadow: 0px 2px 5px -1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

export const UserAvatar = styled(animated.img)`
  width: 45px;
  height: 45px;
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
  margin-top: -2px;
  margin-bottom: 2px;
`;

CheckIn.Location = styled.span`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 4px;
`;

CheckIn.Comment = styled.span`
  display: block;
  font-size: 15px;
  font-weight: 100;
  margin-bottom: 4px;
  grid-column: 2 / -1;
  grid-row: 2 / -1;
`;

CheckIn.TimeAgo = styled.span`
  align-self: start;
  font-size: 12px;
  color: #4d4d4d;
  text-align: left;

  @media (min-width: 390px) {
    font-size: 13px;
  }
`;

/** With Me View **/

export const WithMe = styled.div`
  padding: 10px 25px;
  background-color: #fff;
`;

WithMe.ProtestInfo = styled.div``;

WithMe.ProtestInfo.Title = styled.h3`
  margin: 0;
`;
WithMe.ProtestInfo.Counter = styled.h3`
  font-weight: 400;
  margin-top: 0;
`;

WithMe.Avatars = styled.div``;
