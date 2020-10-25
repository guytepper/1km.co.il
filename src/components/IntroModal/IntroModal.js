import React, { useEffect } from 'react';
import { Modal, LocationButtons } from '../';

export default function IntroModal({ isOpen, setIsOpen, coordinates }) {
  useEffect(() => {
    if (coordinates.length === 2) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  return (
    <Modal isOpen={isOpen}>
      <picture>
        <source
          type="image/webp"
          srcSet="/illustrations/welcome-illustration@2x.webp 1x, /illustrations/welcome-illustration@2x.webp 2x, /illustrations/welcome-illustration@3x.webp 3x"
        />
        <source srcSet="/illustrations/welcome-illustration@1x.png 1x, /illustrations/welcome-illustration@2x.jpg 2x, /illustrations/welcome-illustration@3x.jpg 3x" />
        <Modal.ContentImage src="/welcome-illustration@1x.jpg" alt="" />
      </picture>

      <h2 style={{ marginBottom: 0 }}>גם אלף מטרים לא יעצרו אותנו.</h2>
      <h3 style={{ fontWeight: 400, maxWidth: 355 }}>
        חפשו הפגנה ברדיוס הקרוב אליכן, הצטרפו לקבוצת וואטסאפ וצאו לרחובות. <br />
        <br />
        לא מצאנו? צרו הפגנה חדשה! אנחנו נחבר בינך לבין פעילים ופעילות בסביבה.
      </h3>
      <Modal.ButtonsWrapper>
        <LocationButtons />
      </Modal.ButtonsWrapper>
    </Modal>
  );
}
