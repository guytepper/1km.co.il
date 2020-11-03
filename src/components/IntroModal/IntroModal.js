import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from 'antd';
import { useStore } from '../../stores';
import { LocationButtons } from '../';
import styled from 'styled-components/macro';

function IntroModal({ isOpen, setIsOpen }) {
  const store = useStore();

  useEffect(() => {
    if (store.userCoordinates.length !== 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.userCoordinates]);

  return (
    <ModalWrapper visible={isOpen} footer={null} closeIcon={null}>
      <picture>
        <source
          type="image/webp"
          srcSet="/illustrations/welcome-illustration@2x.webp 1x, /illustrations/welcome-illustration@2x.webp 2x, /illustrations/welcome-illustration@3x.webp 3x"
        />
        <source srcSet="/illustrations/welcome-illustration@1x.png 1x, /illustrations/welcome-illustration@2x.jpg 2x, /illustrations/welcome-illustration@3x.jpg 3x" />
        <ContentImage src="/welcome-illustration@1x.jpg" alt="" />
      </picture>

      <h2 style={{ margin: '10px 0', fontWeight: 600 }}>גם אלף מטרים לא יעצרו אותנו.</h2>
      <h3 style={{ fontWeight: 400, maxWidth: 355 }}>
        חפשו הפגנה ברדיוס הקרוב אליכן, הצטרפו לקבוצת וואטסאפ וצאו לרחובות.
        <br style={{ marginBottom: 5 }} />
        לא מצאנו? צרו הפגנה חדשה! אנחנו נחבר בינך לבין פעילים ופעילות בסביבה.
      </h3>
      <ButtonsWrapper>
        <LocationButtons />
      </ButtonsWrapper>
    </ModalWrapper>
  );
}

export default observer(IntroModal);

const ModalWrapper = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ContentImage = styled.img`
  width: 200px;
  height: 142px;

  @media (min-width: 375px) {
    width: 250px;
    height: 176.7px;
  }
`;

const ButtonsWrapper = styled.div`
  max-width: 280px;
  margin: 0 auto;

  @media (min-width: 400px) {
    max-width: 300px;
  }
`;
