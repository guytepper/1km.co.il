import React from 'react';
import styled from 'styled-components/macro';

function ActionButton({ children, onClick, icon }) {
  return (
    <ActionButtonWrapper onClick={() => onClick()}>
      {icon && <ActionButtonIcon src={icon} alt="" />}
      {children}
    </ActionButtonWrapper>
  );
}

const ActionButtonWrapper = styled.button`
  display: flex;
  width: 65%;
  height: 45px;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 6px 20px;
  background: #6d7bff;
  color: #fff;
  font-family: Simpler, sans-serif;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 25px;
  box-shadow: 0 2px 5px 1px #1d1d1d4d;
  cursor: pointer;
  user-select: none;
  transition: 0.25s all;

  &:hover {
    background-color: #7685ff;
    box-shadow: 0 2px 5px 2px #1d1d1d4d;
  }
`;

const ActionButtonIcon = styled.img`
  width: 25px;
  height: 25px;
  margin-left: 7.5px;
`;

export default ActionButton;
