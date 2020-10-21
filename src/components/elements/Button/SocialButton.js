import React from 'react';
import styled from 'styled-components';

export default function SocialButton({ type, link, children, className }) {
  return (
    <Button href={link} target="_blank" rel="noreferrer noopener" $type={type} className={className}>
      <ImageContainer>
        <img src={`/icons/${type}-button.svg`} alt={type} />
      </ImageContainer>
      <Divider />
      <Text>{children}</Text>
    </Button>
  );
}

export const Button = styled.a`
  width: 284px;
  height: 32px;
  display: flex;
  align-items: center;

  background: ${(props) => {
    switch (props.$type) {
      case 'twitter':
        return '#55ACEE';
      case 'facebook':
        return '#1877F2';
      case 'telegram':
        return 'linear-gradient(180deg, #38AFE3 0%, #1E97C9 100%)';
      case 'whatsapp':
        return '#25D366';
      default:
        return 'black';
    }
  }};
`;

const Divider = styled.div`
  opacity: 0.7;
  background-color: #ffffff;
  width: 1px;
  height: 100%;
  margin-left: 20px;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 19px;

  color: #ffffff;
`;

const ImageContainer = styled.div`
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
