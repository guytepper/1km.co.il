import styled from 'styled-components/macro';

export const FormLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 18px;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
  border: 1px solid #d2d2d2;
  -webkit-appearance: none;
`;

export const InputMessage = styled.span`
  font-size: 14px;
  font-weight: 100;
`;
