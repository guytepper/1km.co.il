import React, { useEffect } from 'react';
import styled from 'styled-components';

function ProjectUpdates() {
  useEffect(() => {
    document.title = `עדכון #1 - קילומטר אחד`;
  }, []);

  return (
    <SupportPageWrapper>
      <SupportPageTitle>עדכון #1</SupportPageTitle>
      <SupportPageParagraph>
        גם בחלומות הכי פרועים שלי לא חלמתי שיקרה מה שקרה בסופ"ש האחרון. לא אכביר במילים ואתן למספרים לדבר:
      </SupportPageParagraph>
      <ul>
        <li> יותר מ- 150,000 מבקרים נכנסו לאתר מאז יום חמישי.</li>
        <li>כ- 800 נקודות הפגנה ברחבי הארץ נוספו למפה .</li>
        <li>עשרות פניות לעזרה ותמיכה בפרוייקט.</li>
      </ul>
      <SupportPageParagraph>
        אלפי מפגינים ומפגינות יצאו לרחובות, חלקן הגדול בפעם הראשונה בכיכר הקרובה לבית. המחאה לא רק שלא דוכאה- היא הגיעה למימדים
        חדשים. אמנם קצת פחות רועש בבלפור, אבל במקום זה המחאה הגיעה לכל שכונה בישראל ואין מי שלא שומע אותה מחוץ לחלון ביתו.
      </SupportPageParagraph>
      <h3>מה עכשיו?</h3>
      <SupportPageParagraph>
        מגבלת הקילומטר יצרה הזדמנות פז להגדיל את המחאה. אנשים שלא יכלו להגיע למוקדי ההפגנה גדולים יכולים עכשיו לצאת לקצה הרחוב
        ולהפגין. ההגבלה על ההפגנות גרמה לאנשים להבין שהמדינה נמצאת בנקודת מפנה ושאי אפשר להשאר אדישים.
      </SupportPageParagraph>
      <SupportPageParagraph>אנחנו רוצים לנצל את המצב הזה ולעזור למחאה להפוך לעוד יותר גדולה, משפיעה ונגישה.</SupportPageParagraph>
      <SupportPageParagraph>התכנון שלנו לשבוע הקרוב:</SupportPageParagraph>
      <ul>
        <li>
          <strong>עמוד הפגנה ייעודי עם פרטים מורחבים</strong> - באיזה ימים ושעות ההפגנה צפויה להתקיים, פרטי יצירת קשר
          (וואטסאפ/טלגרם/פייסבוק) ואפשרות לשיתוף.
        </li>
        <li>
          <strong>גלריית תמונות להפגנה</strong> - אם לפני שבוע סמכנו על צלמי העיתונות שיתעדו את מוקדי ההפגנות השונים, הפעם האחריות
          עוברת למשתתפי ההפגנות. נאפשר להעלות תמונות מכל הפגנה וניצור גלריה מכל ההפגנות בארץ, שתעשה צחוק מכל את אלה שינסו להקטין
          את גודל המחאה.
        </li>
        <li>
          <strong>אפשרות להירשם כמארגני ההפגנה</strong> - מארגני ההפגנה יוכלו לעדכן את תאריכי ושעות ההפגנה, לעדכן את הלינקים
          לקבוצות ולהוסיף מידע נוסף על ההפגנה.
          <br />
          אם מארגני ההפגנה יצטרכו עזרה בלהשיג דגלים, שלטים, אמצעים לוגיסטיים או ייעוץ, הם יוכלו לפנות אלינו ונקשר אותם למי שיכול
          לעזור בנושא.
        </li>
      </ul>
      <h3>תמיכה בפרוייקט</h3>

      <SupportPageParagraph>
        נשמח לעזרה בשביל שנוכל להוציא את התוכניות לפועל. אלו סוגי ההתנדבויות שנשמח לעזר בהן:
      </SupportPageParagraph>
      <ul>
        <li>צוות תמיכה שיענה ויטפל בפניות ממארגנים וממפגינים, יאמת את ההפגנות ויבדוק את המידע שמתעדכן.</li>
        <li>
          אחראיות ואחראי ערים שיהיו בקשר וילוו את מארגני ההפגנות במקום בו הם גרים, יספקו להם תמיכה לוגיסטית ועדכונים (אנחנו נתמוך
          בנושא).
        </li>
        <li>
          מתכנתות ומתכנתים עם ידע ב- React / Firebase שיעזרו לנו להוציא לפועל את הרעיונות ולתקן באגים. גם אם יש לכם שעתיים פנויות
          זה מאוד יעזור. <a href="https://github.com/guytepper/1km.co.il">מחכים לכם בגיטהאב</a>.
        </li>
      </ul>
      <SupportPageParagraph>
        <a href="https://forms.gle/AsikobKb7PpbR1W99" rel="noopener noreferrer" target="_blank">
          מלאו את הטופס
        </a>{' '}
        וניצור קשר בהקדם.
      </SupportPageParagraph>
      <h3>תרומה כספית</h3>
      <SupportPageParagraph>
        עלויות תחזוקת האתר משתנות ככל שהטראפיק עולה וקשה לצפות מה יהיו העלויות בסוף החודש. <br />
        אני עובד על הפרוייקט מרגע פתיחת העיניים ועד שעות הלילה המאוחרות, ואודה על תמיכה שתעזור לי להשאר בראש שקט גם מבחינה כלכלית.
      </SupportPageParagraph>
      <SupportPageParagraph>
        פרטי הוצאות האתר וההכנסות מהתרומות יהיו שקופים ויפורסמו בהמשך. במידה והתרומות יכסו את ההוצאות כשהפרוייקט יגיע לסיום, אפנה
        לכל התורמים והשימוש בכסף ייעשה על פי משאלת ליבם.
      </SupportPageParagraph>
      <SupportPageParagraph>
        אפשר להעביר אליי{' '}
        <a href="https://paypal.me/guytepper" rel="noopener noreferrer" target="_blank">
          תשלום בפייפאל
        </a>
        , או דרך bit - <a href="mailto:guytepper@protonmail.com?subject=העברת תשלום בביט">שלחו לי מייל</a> ואחזיר לכן את מספר הביט
        שלי.
      </SupportPageParagraph>
      <h3>שמרו על קשר</h3>
      <SupportPageParagraph>
        {' '}
        אם תרצו לעקוב אחרי הפרוייקט, פתחנו{' '}
        <a href="https://www.facebook.com/1km.co.il/" rel="noopener noreferrer" target="_blank">
          עמוד פייסבוק
        </a>
        , ומדי פעם <a href="https://twitter.com/guytepper">אצייץ עדכונים בטוויטר</a>.
      </SupportPageParagraph>
      <SupportPageParagraph>
        אם תרצו ליצור איתי קשר ישירות, <a href="mailto:guytepper@protonmail.com">שלחו מייל</a>. עקב עומס פניות אענה בעיכוב (עד
        יום-יומיים), מתנצל מראש.
        <br />
        פניות דחופות אפשר לשלוח ל<a href="https://t.me/sexysoy">טלגרם שלי</a>.{' '}
      </SupportPageParagraph>
      <h3>תודות</h3>
      <SupportPageParagraph>הפרוייקט לא היה יוצא לפועל בלי עזרה של כמה אנשים שקרובים לליבי:</SupportPageParagraph>
      <SupportPageParagraph>
        <strong>אמא ואבא</strong>, שחוץ מזה שהביאוני עד הלום, וויתרו על יום המנוחה וישבו בשבת מ- 8 בבוקר ועד 19 בערב לאשר את
        כמויות ההפגנות העצומות שזרמו למערכת וווידאו שכל פרט בהפגנה מדוייק.
        <br /> הייתי זקוק לעזרה דחופה בהתמודדות עם העומס והם הראשונים שבאו לעזור. לאב יו גאיז 💖
      </SupportPageParagraph>
      <SupportPageParagraph>
        <a href="https://www.megabeets.net/about.html" rel="noopener noreferrer" target="_blank">
          איתי כהן
        </a>
        , שליווה ברעיונות ולבטים שעלו בתהליך הפיתוח והקרדיט על שם האתר והדומיין הולך אליו.
      </SupportPageParagraph>
      <SupportPageParagraph>
        <strong>אמיר אוריין</strong>, שמייעץ בצמתים ותמיד שם להרגיע ולעודד ברגעים מבלבלים.
      </SupportPageParagraph>
      <SupportPageParagraph>
        <strong>גיא קופמן</strong>, שהאיץ בי להוציא את הרעיון לפועל באותו בוקר חמישי שהיה ברור שמשהו מסריח הולך לעבור כאן.
      </SupportPageParagraph>
    </SupportPageWrapper>
  );
}

export default ProjectUpdates;

const SupportPageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto 15px;
  padding: 0 7.5%;
  font-size: 18px;
  line-height: 1.45;

  @media (min-width: 768px) {
    max-width: 600px;
    font-size: 20px;
    margin: 30px auto;
    border-radius: 20px;
    background-color: #fff;
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
