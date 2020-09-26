import React from 'react';
import styled from 'styled-components';

export default function Button(props) {
  return (
    <ButtonWrapper onClick={props.onClick} style={{ width: 300 }}>
      <ButtonIcon src={props.icon} alt="" aria-hidden="true" />
      <span style={{ paddingBottom: 3 }}>{props.children}</span>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button`
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  background: ${(props) => (props.type ? (props.type.whatsapp ? '#1ED96E' : '#6AB2E4') : 'blue')};
  color: #fff;
  font-family: Simpler, sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 6px 20px;
  border: none;
  border-radius: 3px;
`;

const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-inline-end: 10px;
`;
