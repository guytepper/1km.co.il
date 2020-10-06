import styled from 'styled-components/macro';

export const AdminWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  padding: 20px;
`;

export const ProtestSidebarWrapper = styled.div`
  height: 75vh;
`;

export const ProtestsList = styled.ul`
  display: grid;
  grid-auto-rows: min-content;
  gap: 15px;
  padding: 20px;
  list-style-type: none;
  height: 100%;
  overflow: auto;
`;

export const ProtestsListHead = styled.div`
  padding: 0 20px;
`;
export const ProtestsListHeadTitle = styled.h3`
  margin-top: 0;
`;
export const ProtestsListHeadFilters = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
export const ProtestsListHeadFilter = styled.div`
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
