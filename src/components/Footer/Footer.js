import React, { memo } from 'react';
import styled from 'styled-components';

function Footer() {
  return (
    <FooterWrapper>
      <FooterLink href="https://github.com/guytepper/1km" target="_blank">
        <FooterLinkIcon src="/icons/github.svg" alt="" />
        גיטהאב
      </FooterLink>
      <FooterLink href="https://twitter.com/guytepper" target="_blank">
        <FooterLinkIcon src="/icons/twitter.svg" alt="" />
        טוויטר
      </FooterLink>
      <FooterLink href="mailto:guytepper@gmail.com" target="_blank">
        <FooterLinkIcon src="/icons/email.svg" alt="" />
        פידבק
      </FooterLink>
    </FooterWrapper>
  );
}

export default memo(Footer);

const FooterWrapper = styled.footer`
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
