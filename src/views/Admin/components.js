import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Button } from '../../components';

export const AdminWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 4fr;
  position: relative;
  padding: 20px;
`;

export const SidebarWrapper = styled.div`
  height: 70vh;
  grid-column: 1 / 1;
`;

export const FormWrapper = styled.div`
  /* height: 85vh; */
  /* overflow-y: auto; */
  overflow: hidden;
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LeaderCard = styled.div`
  height: 60vh;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0px rgba(80, 80, 82, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

export const AdminNavButton = styled(Button)`
  width: 140px;
  height: 35px;
  font-size: 14px;
`;

export const SidebarList = styled.ul`
  display: grid;
  grid-auto-rows: min-content;
  gap: 15px;
  padding: 20px;
  list-style-type: none;
  height: 100%;
  margin-top: 0;
  overflow: auto;
`;

export const LeaderSidebarCard = styled.li`
  background-color: #fff;
  padding: 15px;
  display: flex;
  align-items: center;
  position: relative;
  ${({ active }) =>
    active &&
    css`
      outline: blue solid 2px;
    `}
  &:hover {
    outline: blue solid ${({ active }) => (active ? 2 : 1)}px;
  }
  cursor: pointer;

  @media (max-width: 1340px) {
    flex-direction: column;
    /* align-items: flex-start; */
  }
`;

export const Field = ({ name, value }) => (
  <div style={{ textAlign: 'right' }}>
    <strong>{name}</strong>: {value ?? 'אין'}
  </div>
);

export const LeaderPhoto = styled.img`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  margin-left: 7px;
  border-radius: 50%;
`;

export const AdminNavigation = styled(Link)`
  grid-column: 2/2;
  position: absolute;
  left: 0;
  top: 15px;
  grid-row: 1/1;
`;

export const SidebarListHead = styled.div`
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: #f4f6fa;
`;
export const SidebarListHeadTitle = styled.h3`
  margin-top: 0;
  align-self: flex-start;
`;
export const SidebarListHeadFilters = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const SidebarListHeadFilter = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.li`
  ${({ active }) =>
    active &&
    css`
      outline: blue solid 2px;
    `}
  &:hover {
    outline: blue solid ${({ active }) => (active ? 2 : 1)}px;
  }
  cursor: pointer;
  background-color: #fff;
  padding: 15px;
`;

export const DetailsWrapper = styled.form`
  justify-self: center;
`;

export const ProtestDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
`;

export const ProtestDetailLabel = styled.label``;

export const ProtestDetailInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;

export const MapWrapper = styled(Map)`
  width: 100%;
  height: 550px;
  margin-bottom: 10px;
  z-index: 0;
`;
