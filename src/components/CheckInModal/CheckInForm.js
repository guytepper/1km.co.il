import React, { useState, useEffect } from 'react';
import { Button } from '../elements';
import { FormLabel, TextInput, InputMessage } from '../FormElements';
import { createCheckIn, updateUserFirstName } from './CheckInService';

function CheckInForm({ user }) {
  const [firstName, setFirstName] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const newCheckIn = async () => {
    try {
      const checkIn = await createCheckIn({ firstName, userMessage, picture_url: user?.picture_url });

      if (user?.uid && user.first_name !== firstName) {
        await updateUserFirstName({ userId: user.uid, firstName });
      }
      console.log(checkIn);
      // Open social links modal
      // setTimeout(() => {
      //   setSocialLinks(true);
      // }, 2020);
    } catch (err) {
      console.error(err);
    }
  };

  // Use the user's first name if available
  useEffect(() => {
    console.log(user);
    if (user?.first_name) {
      console.log(user.first_name);
      setFirstName(user.first_name);
    }
  }, [user]);

  return (
    <div>
      <FormLabel>
        כינוי <TextInput onChange={(e) => setFirstName(e.target.value)} value={firstName} />
        {user?.first_name && <InputMessage>מומלץ לעדכן את השם לעברית.</InputMessage>}
      </FormLabel>
      <FormLabel>
        מסר לאומה (לא חובה)
        <TextInput onChange={(e) => setUserMessage(e.target.value)} value={userMessage} maxLength="80" />
        {userMessage.length > 72 && <InputMessage>80 תווים לכל היותר.</InputMessage>}
      </FormLabel>
      <Button disabled={firstName === ''} onClick={() => newCheckIn()}>
        צ'ק אין
      </Button>
    </div>
  );
}

export default CheckInForm;
