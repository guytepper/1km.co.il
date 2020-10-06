import React, { useEffect } from 'react';
import styled from 'styled-components/macro';

function ProjectSupportPage() {
  useEffect(() => {
    document.title = `תמכו בפרוייקט - קילומטר אחד`;
  }, []);

  return (
    <SupportPageWrapper>
      <SupportPageTitle>תמיכה בפרוייקט</SupportPageTitle>
      <SupportPageParagraph>היי! קוראים לי גיא טפר, אני בן 25 וגר בירושלים. </SupportPageParagraph>
      <SupportPageParagraph>בחמישי שעבר פתחתי את העיתון וראיתי שהגבלות התנועה צפויות לחול על הפגנות.</SupportPageParagraph>
      <SupportPageParagraph>
        זה היה מרתיח ומעורר פחד. אבל אז חשבתי שאם הפגנות יתקיימו בכל שכונה בארץ, אם בכל קילומטר במדינה ישמעו את קול המחאה - לא
        יהיה בית בישראל שיוכל להתעלם ממנה.
      </SupportPageParagraph>
      <SupportPageParagraph>
        לא צפיתי את כמות הפגנות שיישלחו, את התנועה הגדולה וכמות הפניות למייל. כל הפגנה עוברת בדיקת תקינות, אני משתדל לחזור לכל אחד
        ואחת ולתקן כל נתון חסר או שגוי.
      </SupportPageParagraph>
      <SupportPageParagraph>מאוד משמח אותי לקבל את התגובות החמות, אבל הכי ישמח אותי ידיים עוזרות. </SupportPageParagraph>
      <SupportPageParagraph>
        אם תרצו לקחת חלק בפרוייקט, <a href="mailto:guytepper@protonmail.com">שלחו לי מייל</a>. גם אם כל מה שיש לכן להציע זה זמן
        פנוי זה בהחלט יהיה מועיל.
      </SupportPageParagraph>
      אם אתן מתכנתות, <a href="https://github.com/guytepper/1km.co.il">האתר נכתב בקוד פתוח וזמין בגיטהאב</a>, יש פיצ’רים חדשים
      ובאגים חביבים ואשמח לכל עזר.
      <SupportPageParagraph>
        עלויות התחזוקה עולות ככל שהאתר מופץ, והעבודה עליו בימים אלה לוקחת את כל זמני - מ- 6 בבוקר ועד 22 בלילה.
        <br /> אהיה אסיר תודה על כל סכום לצורך כיסוי עלויות האתר ותפעולו.
      </SupportPageParagraph>
      <SupportPageParagraph>
        אפשר להעביר אליי{' '}
        <a href="https://paypal.me/guytepper" rel="noopener noreferrer" target="_blank">
          תשלום בפייפאל
        </a>
        , או דרך bit - <a href="mailto:guytepper@protonmail.com?subject=העברת תשלום בביט">שלחו לי מייל</a> ואחזיר לכן את מספר הביט
        שלי.
        <br />
      </SupportPageParagraph>
      <SupportPageParagraph>נפגש ברחובות!</SupportPageParagraph>
    </SupportPageWrapper>
  );
}

export default ProjectSupportPage;

const SupportPageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto 15px;
  padding: 0 7.5%;
  font-size: 18px;
  line-height: 1.3;

  @media (min-width: 768px) {
    max-width: 600px;
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    max-width: 800px;
    /* font-size: 21px; */
  }

  & a {
    font-weight: 600;
  }
`;

const SupportPageTitle = styled.h2`
  text-align: center;
`;

const SupportPageParagraph = styled.p``;
