import React from 'react';
import styled from 'styled-components';
import PlacesAutocomplete from '../PlacesAutocomplete';
import Button from '../Button';

function ProtestForm() {
  import { useForm } from 'react-hook-form';

  return (
    <ProtestFormWrapper>
      <ProtestFormLabel>מיקום ההפגנה</ProtestFormLabel>
      <PlacesAutocomplete />
      <ProtestFormLabel>
        שעת מפגש
        <ProtestFormInput type="time" value="17:30"></ProtestFormInput>
      </ProtestFormLabel>
      <ProtestFormLabel>
        קבוצת וואטסאפ
        <ProtestFormInput placeholder="לינק לקבוצה"></ProtestFormInput>
      </ProtestFormLabel>
      <ProtestFormLabel>
        קבוצת טלגרם
        <ProtestFormInput placeholder="לינק לקבוצה"></ProtestFormInput>
      </ProtestFormLabel>
      <ProtestFormLabel>
        הערות
        <ProtestFormInput placeholder="הערות להפגנה"></ProtestFormInput>
        <ProtestFormInputDetails>כל דבר שחשוב שיופיע בפרטי ההפגנה.</ProtestFormInputDetails>
      </ProtestFormLabel>
      <ProtestFormLabel>
        כתובת מייל
        <ProtestFormInput type="email" placeholder="האימייל שלך"></ProtestFormInput>
        <ProtestFormInputDetails>
          אם פרטי ההפגנה לא יהיו ברורים לנו ונצטרך ליצור קשר. לא יועבר לשום גורם אחר.
        </ProtestFormInputDetails>
      </ProtestFormLabel>
      <Button color="#1ED96E"> הוספת הפגנה</Button>
    </ProtestFormWrapper>
  );
}

const ProtestFormWrapper = styled.form`
  width: 300px;
  margin: 25px auto;
  justify-items: center;

  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const ProtestFormLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ProtestFormInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 16px;
`;

const ProtestFormInputDetails = styled.span`
  font-size: 14px;
  font-weight: 300;
`;

export default ProtestForm;
