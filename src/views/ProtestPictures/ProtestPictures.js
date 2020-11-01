import React from 'react';
import { ProtestPicturesWrapper, HeroImage, ProtestPictureSection, InfoBox, ProtestImage } from './ProtestPicturesElements';

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
        <InfoBox>
          <p>בסוף השבוע האחרון התחלנו לאפשר העלאת תמונות לאתר קילומטר אחד.</p>
          <p>
            עשרות תמונות נשלחו, ורצינו ליצור מקום שייתן במה לתמונות נבחרות מדי שבוע - בנוסף לעמודי ההפגנות באתר שם אפשר לצפות
            בתמונות מכל הפגנה.
          </p>
          <p> העמוד הזה יעודכן בכל יום ראשון עם תמונות חדשות מסוף השבוע.</p>
          <p>אפשר להעלות תמונות במהלך השבוע, ובעיקר בכל יום שבת.</p>
          <p>עקבו אחרינו בפייסבוק לקבלת עדכונים!</p>
        </InfoBox>
        <ProtestImage imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604256862/weekend_pictures/31-10-2020/pinkfront.jpg" />
        <ProtestImage imageUrl="https://res.cloudinary.com/onekm/image/upload/v1604256316/weekend_pictures/31-10-2020/gesher01.jpg" />
        <ProtestImage imageUrl="https://res.cloudinary.com/onekm/image/upload/c_fill,g_auto,h_700,w_570/v1604257020/weekend_pictures/31-10-2020/submaringate-wrong-person-arrested.jpg">
          <ProtestImage.Description>
            <p>
              רועי פלג, ממובילי תנועת חקירה עכשיו, נעצר במהלך צעדת מחאה בכביש 1.{' '}
              <a
                href="https://www.facebook.com/roey.peleg/posts/10224908923856122?__cft__[0]=AZXuTo6QNqEa0PlpxdU_kg2AGJ7JmDkq9hekO7zFCR-bNDCsapt4zQO3bJA1sbCxFr8pu4rh8w9GiSqKhL6dIqAsYumuIWtkQ6rV64HHcMSmgdZ8-Wga0G8ipalzn3pt5os&__tn__=%2CO%2CP-R"
                target="_blank"
              >
                לפוסט בפייסבוק
              </a>
            </p>
          </ProtestImage.Description>
        </ProtestImage>
        <ProtestImage imageUrl="https://res.cloudinary.com/onekm/image/upload/c_fill,g_auto,h_700,w_570/v1604257020/weekend_pictures/31-10-2020/submaringate-wrong-person-arrested.jpg">
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
    </ProtestPicturesWrapper>
  );
}

export default ProtestPictures;
