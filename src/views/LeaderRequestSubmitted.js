import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, PageWrapper, PageContentWrapper, PageParagraph } from '../components';

export default function LeaderRequestSubmitted(props) {
  const history = useHistory();

  return (
    <PageWrapper>
      <PageContentWrapper>
        <PageParagraph>
          תודה שהגשת בקשה לעריכה של עמוד ההפגנה.
          <br />
          צוות האתר יצור איתך קשר בהקדם האפשרי.
          <br />
          יחד ננצח!
        </PageParagraph>
        <Button onClick={() => history.push('/')}>חזרה לעמוד הראשי</Button>
      </PageContentWrapper>
    </PageWrapper>
  );
}
