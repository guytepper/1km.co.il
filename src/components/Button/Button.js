import React from 'react';
import styled from 'styled-components/macro';

export default function Button(props) {
  const { color, type, onClick, disabled, style, icon, children, className } = props;
  return (
    <ButtonWrapper color={color} type={type} onClick={onClick} disabled={disabled} style={style} className={className}>
      {icon && <ButtonIcon src={icon} alt="" aria-hidden="true" />}
      <span style={{ paddingBottom: 3 }}>{children}</span>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button`
  display: flex;
  width: 300px;
  height: 50px;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  background: ${(props) => {
    if (props.color) return props.color;
    if (props.type) return props.type.whatsapp ? '#1ED96E' : '#6AB2E4';
    return 'radial-gradient(100.6% 793.82% at 9.54% -0.6%, #6C7BFD 0%, #2938B7 100%)';
  }};
  color: #fff;
  font-family: Simpler, sans-serif;
  font-size: 20px;
  font-weight: 600;
  padding: 6px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:disabled {
    background: grey;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-inline-end: 10px;
`;
