import styled from 'styled-components/macro';

export const PageWrapper = styled.div`
  margin: 0 auto;
  text-align: center;
  font-size: 18px;

  @media (min-width: 768px) {
    max-width: 380px;
    font-siz: 20px;
  }
`;

export const PageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 320px;
`;
