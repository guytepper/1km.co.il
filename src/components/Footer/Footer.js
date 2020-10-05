import React, { memo } from 'react';
import styled from 'styled-components/macro';

function Footer() {
  return (
    <FooterWrapper>
      <FooterLink href="https://twitter.com/1kmcoil" target="_blank">
        <FooterLinkIcon src="/icons/twitter.svg" alt="" />
        טוויטר
      </FooterLink>
      <FooterLink href="https://facebook.com/1km.co.il" target="_blank">
        <FooterLinkIcon src="/icons/facebook.svg" alt="" />
        פייסבוק
      </FooterLink>
      <FooterLink href="mailto:support@1km.co.il" target="_blank">
        <FooterLinkIcon src="/icons/email.svg" alt="" />
        פידבק
      </FooterLink>
    </FooterWrapper>
  );
}

export default memo(Footer);

const FooterWrapper = styled.footer`
  position: sticky;
  display: flex;
  align-items: center;
  padding: 15px;
  opacity: 0.6;
  justify-content: flex-end;

  @media (min-width: 768px) {
    position: sticky;
    padding: 10px 0;
  }
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0 5px;
  font-size: 14px;
`;

const FooterLinkIcon = styled.img`
  width: 17.5px;
  margin-inline-end: 5px;
`;
