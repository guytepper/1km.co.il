import React, { useState } from 'react';
import { Button } from '../elements';
import { FormLabel, TextInput, InputMessage } from '../FormElements';

function CheckInForm({ onCheckIn }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userMessage, setUserMessage] = useState('');

  return (
    <div>
      <FormLabel>
        שם פרטי / כינוי
        <TextInput onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="מה שמכם?" autoFocus />
      </FormLabel>
      <FormLabel>
        שם משפחה <TextInput onChange={(e) => setLastName(e.target.value)} placeholder="לא חובה." value={lastName} />
      </FormLabel>
      <FormLabel>
        מסר לאומה
        <TextInput onChange={(e) => setUserMessage(e.target.value)} value={userMessage} placeholder="לא חובה." maxLength="80" />
        {userMessage.length > 72 && <InputMessage>80 תווים לכל היותר.</InputMessage>}
      </FormLabel>
      {/* <FormLabel>
        לשון פנייה
        <TextInput onChange={(e) => setUserMessage(e.target.value)} value={userMessage} placeholder="לא חובה." maxLength="80" />
      </FormLabel> */}
      <Button disabled={firstName === ''} onClick={() => onCheckIn({ firstName, lastName, userMessage })}>
        צ'ק אין
      </Button>
    </div>
  );
}

export default CheckInForm;
