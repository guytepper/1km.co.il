import React from 'react';
import { ProtestCardGroupButton, ProtestCardIcon } from '../../components/ProtestCard/ProtestCardStyles';
import * as S from './ProtestPage.style';

function getEditButtonLink(user, protest) {
  const editRoute = `/protest/${protest.id}/edit`;

  if (!utils.isAdmin(user) || utils.isAuthenticated(user)) {
    return editRoute;
  }

  if (utils.isVisitor(user)) {
    // Sign up before redirected to leader request
    return `/sign-up?returnUrl=${editRoute}`;
  }
  throw new Error(`couldn't find route`);
}

function ProtestLatestPictures({ protest, futureDates, user }) {
  return (
    <S.DatesAndSocial>
      <S.SectionContainer>
        <S.SectionTitle>
          <img src="/icons/clock.svg" alt="" />
          מועדי הפגנה קרובים
        </S.SectionTitle>

        <S.Dates>
          {futureDates.length > 0 ? (
            futureDates.map((dateTime) => (
              <S.DateCard key={dateTime.id}>
                <S.DateText>
                  <h3 style={{ display: 'inline-block', margin: 0 }}>{utils.formatDate(dateTime.date)}</h3> - יום{' '}
                  {utils.dateToDayOfWeek(dateTime.date)} בשעה {dateTime.time}
                </S.DateText>
              </S.DateCard>
            ))
          ) : (
            <S.DateCard>
              <h3>לא עודכנו מועדי הפגנה קרובים.</h3>
              <p>יודעים מתי ההפגנה הבאה? לחצו על הכפתור לעדכון!</p>
            </S.DateCard>
          )}
        </S.Dates>
        <S.EditButton onClick={() => history.push(getEditButtonLink(user, protest))}>עדכון מועדי הפגנה</S.EditButton>
      </S.SectionContainer>

      <S.SectionContainer>
        <S.SectionTitle>
          <ProtestCardIcon src="/icons/social.svg" alt="share icon" />
          ערוצי תקשורת
        </S.SectionTitle>
        {protest.whatsAppLink && (
          <ProtestCardGroupButton type="whatsapp" href={protest.whatsAppLink} target="_blank">
            הצטרפות לקבוצת הוואטסאפ
          </ProtestCardGroupButton>
        )}
        {protest.telegramLink && (
          <ProtestCardGroupButton type="telegram" href={protest.telegramLink} target="_blank">
            הצטרפות לקבוצת הטלגרם
          </ProtestCardGroupButton>
        )}
        {!protest.whatsAppLink && !protest.telegramLink && <p>להפגנה זו אין דרכי תקשורת.</p>}
        <S.EditButton onClick={() => history.push(getEditButtonLink(user, protest))}>עדכון דרכי תקשורת</S.EditButton>
      </S.SectionContainer>
    </S.DatesAndSocial>
  );
}

export default ProtestLatestPictures;
