import React from 'react';
import { Link } from 'react-router-dom';
import {
  ProtestPicturesWrapper,
  ProtestPicturesHeader,
  ProtestPicturesSubheader,
  ProtestPicturesText,
  HeroImage,
  ProtestPictureSection,
  InfoBox,
  ProtestImage,
  ImageLocation,
  ImageCredit,
} from './ProtestPicturesElements';
import './ProtestPictures.css';

function ProtestPictures() {
  return (
    <ProtestPicturesWrapper>
      <HeroImage>
        <HeroImage.TextWrapper>
          <HeroImage.Title>תמונות מחאה</HeroImage.Title>
          <HeroImage.Subtitle>29-31.10.20</HeroImage.Subtitle>
        </HeroImage.TextWrapper>
      </HeroImage>
      <ProtestPictureSection imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604253080/weekend_pictures/31-10-2020/first-bg_uozjrt.jpg">
        <InfoBox id="info-box">
          <p>בסוף השבוע האחרון התחלנו לאפשר העלאת תמונות לאתר קילומטר אחד.</p>
          <p>
            עשרות תמונות נשלחו, ורצינו ליצור מקום שייתן במה לתמונות נבחרות מדי שבוע - בנוסף לעמודי ההפגנות באתר שם אפשר לצפות
            בתמונות מכל הפגנה.
          </p>
          <p> העמוד הזה יעודכן בכל יום ראשון עם תמונות חדשות מסוף השבוע.</p>
          <p>אפשר להעלות תמונות במהלך השבוע, ובעיקר בכל יום שבת.</p>
          <p>עקבו אחרינו בפייסבוק לקבלת עדכונים!</p>
        </InfoBox>
        <ProtestImage
          id="gesher"
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604256316/weekend_pictures/31-10-2020/gesher01.jpg"
        />
        <ProtestImage
          id="pinkfront"
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604256862/weekend_pictures/31-10-2020/pinkfront.jpg"
        >
          <ProtestImage.Description>
            <p>
              חיילות צבא הדמוקרטיה בבלפור. <br />
              <a href="https://www.facebook.com/PinkFrontIL" target="_blank" rel="noreferrer">
                פינקפרונט - החזית הורודה
              </a>{' '}
            </p>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage imageUrl="https://res.cloudinary.com/onekm/image/upload/c_scale,q_auto:low,w_740/v1604261694/weekend_pictures/31-10-2020/IMG_1559_qfhq7k.jpg"></ProtestImage>
        <ProtestImage
          id="roey-peleg-arrest"
          imageUrl="https://res.cloudinary.com/onekm/image/upload/c_fill,g_auto,h_700,w_570/v1604257020/weekend_pictures/31-10-2020/submaringate-wrong-person-arrested.jpg"
        >
          <ProtestImage.Description>
            <p>
              רועי פלג, ממובילי תנועת חקירה עכשיו, נעצר במהלך צעדת מחאה בכביש 1.{' '}
              <a
                href="https://www.facebook.com/roey.peleg/posts/10224908923856122?__cft__[0]=AZXuTo6QNqEa0PlpxdU_kg2AGJ7JmDkq9hekO7zFCR-bNDCsapt4zQO3bJA1sbCxFr8pu4rh8w9GiSqKhL6dIqAsYumuIWtkQ6rV64HHcMSmgdZ8-Wga0G8ipalzn3pt5os&__tn__=%2CO%2CP-R"
                target="_blank"
                rel="noreferrer"
              >
                לפוסט בפייסבוק
              </a>
            </p>
          </ProtestImage.Description>
        </ProtestImage>
      </ProtestPictureSection>
      <ProtestPictureSection
        style={{ backgroundPosition: 'top' }}
        imageUrl="https://res.cloudinary.com/onekm/image/upload/q_auto:eco/v1604264028/weekend_pictures/31-10-2020/rabin-sqaure_pmcyeu.jpg"
      >
        <div style={{ gridColumn: '1 / 3' }}>
          <ProtestPicturesHeader>זוכרים את הרצח</ProtestPicturesHeader>
          <ProtestPicturesSubheader style={{ marginBottom: 10 }}>כיכר רבין, 29/30/20</ProtestPicturesSubheader>
          <ProtestPicturesText>ברחבי הארץ צוין יום הזכרון לרצח ראש הממשלה יצחק רבין.</ProtestPicturesText>
          <ProtestPicturesText>
            בימים אלו, כשראש ממשלה מכהן מסית כנגד חלק ניכר מהעם, חשוב לזכור את נקודת הקצה שמדינת ישראל הגיעה אליה לפני 25 שנה
            ולהתנגד בכל הכח להסתה.
          </ProtestPicturesText>
        </div>
        <p style={{ gridRow: 2, fontSize: 14, color: '#fff8f8db' }}>צילום: רונן טופלברג</p>
      </ProtestPictureSection>
      <ProtestPictureSection style={{ background: '#000' }} id="rabin-square-picures">
        <ProtestImage
          id="candles"
          imageUrl="https://res.cloudinary.com/onekm/image/upload/q_auto:low/v1604264691/weekend_pictures/31-10-2020/candles_gf8czy.jpg"
        >
          <ImageCredit>צילום: אורן זיו</ImageCredit>
        </ProtestImage>
        <ProtestImage
          id="candles2"
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604264691/weekend_pictures/31-10-2020/candles2_kxjbzp.jpg"
        >
          <ImageCredit>צילום: אורן זיו</ImageCredit>
        </ProtestImage>
        <ProtestImage
          id="clock-square-rabin"
          imageUrl="https://res.cloudinary.com/onekm/image/upload/q_auto:low/v1604266088/weekend_pictures/31-10-2020/clock-square-rabin_u5wwtg.jpg"
        >
          <ImageLocation>כיכר השעון, יפו</ImageLocation>
        </ProtestImage>
        <ProtestImage
          id="zion-square-rabin"
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604266150/weekend_pictures/31-10-2020/zion_square_egjtwi.jpg"
        >
          <ImageLocation>כיכר ציון, ירושלים</ImageLocation>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/q_auto:low/v1604266437/weekend_pictures/31-10-2020/givaat_amal_rabin_ykvd6p.jpg"
        >
          <ImageLocation>טקס זכרון, גבעת עמל</ImageLocation>
        </ProtestImage>
      </ProtestPictureSection>
      <ProtestPictureSection style={{ background: '#d83039' }} id="nationwide-section">
        <div>
          <ProtestPicturesHeader>כל הארץ דגלים</ProtestPicturesHeader>
          <ProtestPicturesText>
            השבוע ה-19 למחאה הארצית: כ- 185,000 אזרחים ואזרחיות יצאו למחות ביותר מ-1000 נקודות ברחבי הארץ.{' '}
          </ProtestPicturesText>
          <ProtestPicturesText>לחצו על שם ההפגנה לצפייה בתמונות נוספות מהמיקום :) </ProtestPicturesText>
        </div>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604213419/protest_pictures/HCH3gs3PFYzAXTx5ufRc/2020-31-10/-i50z_ySAjaONCUQ_aGYp.jpg"
        >
          <ProtestImage.Description>
            <p>
              <Link to="/protest/HCH3gs3PFYzAXTx5ufRc">ירושלים פינת אחוזה, רעננה</Link>
            </p>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604160398/protest_pictures/EW5fekCQwh75gdBqk29w/2020-31-10/rWdaGeQGQsdwhREO9XTid.jpg"
        >
          <ProtestImage.Description>
            <Link to="/protest/EW5fekCQwh75gdBqk29w">כיכר לוחמות השואה, הרצליה</Link>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604167916/protest_pictures/4MaSQQmj6jGoFW0cmNkO/2020-31-10/wOXnS3OIXP28pE2Mt5QW5.jpg"
        >
          <ProtestImage.Description>
            <Link to="/protest/4MaSQQmj6jGoFW0cmNkO">אחוזה/בן גוריון, רעננה</Link>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          style={{ maxHeight: 210 }}
          imgStyle={{ objectPosition: 'top' }}
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604163581/protest_pictures/OASal66GwOGQlFqKvqWA/2020-31-10/EGE0sTjAy5pRWcRTfO_ae.jpg"
        >
          <ProtestImage.Description>
            <Link to="/protest/OASal66GwOGQlFqKvqWA">צומת טופ דן, תל אביב</Link>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604166279/protest_pictures/NvsaAM3lMbs6VyvE5Nq3/2020-31-10/LSPWParvBMyE826S9q4KM.jpg"
        >
          <ProtestImage.Description>
            <Link to="/protest/NvsaAM3lMbs6VyvE5Nq3">כיכר השעון, יפו</Link>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604220783/protest_pictures/rcru0d98x0zySthMmMUs/2020-31-10/_aisYQZqmUNW194VoMAFp.jpg"
        >
          <ProtestImage.Description>
            <Link to="/protest/rcru0d98x0zySthMmMUs">צומת בית יהושוע</Link>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/c_scale,q_auto:low,w_1364/v1604299974/weekend_pictures/31-10-2020/ness_ziona_likud.jpg"
        >
          <ProtestImage.Description>
            <p>קניון עופר, נס ציונה. צילום: ראובן להב</p>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604300401/weekend_pictures/31-10-2020/bnei_dror_gesher.jpg"
        >
          <ProtestImage.Description>
            <p>צומת בני דרור</p>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604300790/weekend_pictures/31-10-2020/geshser_kfar_bialik.jpg"
        >
          <ProtestImage.Description>
            <p>גשר כפר ביאליק</p>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage
          id=""
          imageUrl="https://res.cloudinary.com/onekm/image/upload/q_auto:low/v1604300825/weekend_pictures/31-10-2020/zomet_oh.jpg"
        >
          <ProtestImage.Description>
            <p>גשר כפר ביאליק</p>
          </ProtestImage.Description>
        </ProtestImage>
      </ProtestPictureSection>
      <ProtestPictureSection
        imageUrl="https://res.cloudinary.com/onekm/image/upload/q_auto:low/v1604302235/weekend_pictures/31-10-2020/balfur-bg_mvjzov.jpg"
        id="balfur-section"
      >
        <div>
          <ProtestPicturesHeader>מהנעשה בבלפור</ProtestPicturesHeader>

          <ProtestPicturesText>
            המחאה בירושלים התחילה בעצרת זכרון ליצחק רבין בכיכר ציון. משם צעדו אל כיכר פריז שם הפגינו כ-20 אלף אנשים אל מול מעון
            ראש הממשלה.
          </ProtestPicturesText>
        </div>
      </ProtestPictureSection>
    </ProtestPicturesWrapper>
  );
}

export default ProtestPictures;
