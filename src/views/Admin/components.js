import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

export const AdminWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  padding: 20px;
`;

export const SidebarWrapper = styled.div`
  height: 70vh;
  grid-column: 1 / 1;
`;

export const ProtestFormWrapper = styled.div`
  /* height: 85vh; */
  /* overflow-y: auto; */
  overflow: hidden;
  grid-column: 2 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const AdminNavigation = styled(Link)`
  grid-column: 4/4;
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
export const SidebarListHeadFilter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.li`
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
