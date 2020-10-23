import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useHistory, useParams } from 'react-router-dom';
import { fetchProtest, makeUserProtestLeader, sendProtestLeaderRequest, updateProtest, getProtestsForLeader } from '../api';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { ProtestForm, ProtectedRoute } from '../components';
import { Switch, Route } from 'react-router-dom';
import {
  ProtestCardInfo,
  ProtestCardDetail,
  ProtestCardIcon,
  ProtestCardGroupButton,
} from '../components/ProtestCard/ProtestCardStyles';
import {
  dateToDayOfWeek,
  formatDate,
  isAdmin,
  sortDateTimeList,
  isAuthenticated,
  isVisitor,
  calculateDistance,
  formatDistance,
} from '../utils';

const mobile = `@media (max-width: 768px)`;

function getEditButtonLink(user, protest) {
  const editRoute = `/protest/${protest.id}/edit`;

  if (isAdmin(user) || isAuthenticated(user)) {
    return editRoute;
  }

  if (isVisitor(user)) {
    // Sign up before redirected to leader request
    return `/sign-up?returnUrl=${editRoute}`;
  }

  throw new Error(`couldn't find route`);
}

function getSocialLinks(protest) {
  const items = [];
  const { whatsAppLink, telegramLink } = protest;

  if (whatsAppLink) {
    items.push({ type: 'whatsapp', url: whatsAppLink, text: 'הצטרפות לקבוצת הוואטסאפ' });
  }
  if (telegramLink) {
    items.push({ type: 'telegram', url: telegramLink, text: 'הצטרפות לקבוצת הטלגרם' });
  }

  return items;
}

async function _fetchProtest(id, setProtest) {
  const protest = await fetchProtest(id);

  if (protest) {
    setProtest(protest);
  } else {
    // TODO: handle 404
  }
}

function useFetchProtest() {
  const [protest, setProtest] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    _fetchProtest(id, setProtest);
  }, [id]);

  return {
    protest: protest
      ? {
          ...protest,
          dateTimeList: sortDateTimeList(protest.dateTimeList),
        }
      : null,
    setProtest,
  };
}

function ProtestPageContent({ protest, user, userCoordinates }) {
  const history = useHistory();
  const { coordinates, displayName, streetAddress, notes, dateTimeList, meeting_time } = protest;
  const socialLinks = getSocialLinks(protest);

  return (
    <ProtestPageContainer>
      <MapWrapper center={{ lat: coordinates.latitude, lng: coordinates.longitude }} zoom={14}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={{ lat: coordinates.latitude, lng: coordinates.longitude }}></Marker>
      </MapWrapper>

      <ProtestContainer>
        <Info>
          {/* <ProfilePic src="/protest-profile-pic.png" alt="Protester with flag getting sprayed" /> */}
          <Details>
            <Title>{displayName}</Title>
            <ProtestCardInfo>
              {streetAddress && (
                <ProtestCardDetail>
                  <ProtestCardIcon src="/icons/location.svg" alt="" aria-hidden="true" title="מיקום ההפגנה" />
                  {streetAddress}
                </ProtestCardDetail>
              )}
              {userCoordinates.length > 0 && (
                <ProtestCardDetail>
                  <ProtestCardIcon src="/icons/ruler.svg" alt="" />
                  {formatDistance(calculateDistance(userCoordinates, [coordinates.latitude, coordinates.longitude]))}
                </ProtestCardDetail>
              )}
              {notes && <ProtestCardDetail style={{ textAlign: 'center' }}>{notes}</ProtestCardDetail>}
            </ProtestCardInfo>
          </Details>
        </Info>

        <DatesAndSocial>
          {/* Dates */}
          <SectionContainer>
            <SectionTitle>
              <img src="/icons/clock.svg" alt="clock icon" />
              מועדי הפגנה קרובים
            </SectionTitle>

            <Dates>
              {dateTimeList ? (
                dateTimeList.map((dateTime) => (
                  <Date key={dateTime.id}>
                    <BoldDateText>{formatDate(dateTime.date)}</BoldDateText>
                    <DateText>
                      יום {dateToDayOfWeek(dateTime.date)} בשעה {dateTime.time}
                    </DateText>
                  </Date>
                ))
              ) : (
                <Date>
                  <BoldDateText> שעת מפגש: {meeting_time}</BoldDateText>
                </Date>
              )}
            </Dates>
            <EditButton onClick={() => history.push(getEditButtonLink(user, protest))}>עדכון מועדי הפגנה</EditButton>
          </SectionContainer>

          {/* Social */}
          <SocialContainer>
            <SectionTitle>
              <ProtestCardIcon src="/icons/social.svg" alt="share icon" />
              ערוצי תקשורת
            </SectionTitle>
            {socialLinks.length > 0 ? (
              <>
                <SocialButtons>
                  {socialLinks.map(({ url, type, text }) => (
                    <ProtestCardGroupButton key={type} type={type} href={url} target="_blank">
                      {text}
                    </ProtestCardGroupButton>
                  ))}
                </SocialButtons>
              </>
            ) : (
              <p>להפגנה זו אין ערוצי תקשורת.</p>
            )}
            <EditButton onClick={() => history.push(getEditButtonLink(user, protest))}>עדכון דרכי תקשורת</EditButton>
          </SocialContainer>
        </DatesAndSocial>
      </ProtestContainer>
    </ProtestPageContainer>
  );
}

export default function ProtestPage({ user, userCoordinates }) {
  const { protest, setProtest } = useFetchProtest();
  const history = useHistory();
  // const { onFileUpload } = useFileUpload(false);

  if (!protest) {
    // TODO: loading state
    return <div>טוען...</div>;
  }

  const { coordinates, id: protestId } = protest;
  const canEdit = !isVisitor(user);

  return (
    <Switch>
      <ProtectedRoute path="/protest/:id/edit" authorized={canEdit}>
        <EditViewContainer>
          <ProtestForm
            initialCoords={[coordinates.latitude, coordinates.longitude]}
            submitCallback={async (params) => {
              // If the user is not a leader for this protest, check if they've reached the amount of protests limit.
              if (!protest.roles?.leader.includes(user.uid) && !isAdmin(user)) {
                const userProtests = await getProtestsForLeader(user.uid);

                if (userProtests.length > 4) {
                  alert('לא ניתן לערוך מידע על יותר מ- 5 הפגנות.\n צרו איתנו קשר אם ישנו צורך לערוך הפגנות מעבר למכסה.');
                  throw new Error('Reached the max amount of protests a user can lead');
                }

                await sendProtestLeaderRequest(user, null, protestId);
                await makeUserProtestLeader(protestId, user.uid);
              }

              const response = await updateProtest({ protestId, params, userId: user.uid });

              // Refetch the protest once update is complete
              _fetchProtest(protestId, setProtest);

              return response;
            }}
            afterSubmitCallback={() => history.push(`/protest/${protestId}`)}
            defaultValues={protest}
            editMode={true}
            isAdmin={isAdmin(user)}
          />
        </EditViewContainer>
      </ProtectedRoute>
      <Route>
        <ProtestPageContent protest={protest} userCoordinates={userCoordinates} user={user} />
      </Route>
    </Switch>
  );
}

//----------------- Styles -------------------------//

const EditViewContainer = styled.div`
  width: 80%;
  max-width: 1000px;
  padding: 24px 0;
  margin: 0 auto;
`;

const ProtestPageContainer = styled.div`
  color: #000000;
  padding-bottom: 150px;
  h1,
  h1 {
    margin: 0;
  }
`;

const ProtestContainer = styled.div`
  margin: 0 auto;
  max-width: 700px;
  padding: 0 15px;
  z-index: 1;

  @media (min-width: 1024px) {
    max-width: 920px;
  }
`;

const Info = styled.div`
  position: relative;
  padding: 20px 34px;
  background: #ffffff;
  box-shadow: 0px 4px 10px -1px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  margin-top: -30px;
  z-index: 5;

  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: 1fr 200px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 28px;
  line-height: 47px;
  color: #000000;
  margin-bottom: 8px;
`;

const MapWrapper = styled(Map)`
  width: 100%;
  height: 256px;
  z-index: 0;
`;

const EditButton = styled.button`
  width: 100%;
  height: 32px;
  color: #1251f3;
  border: 1px solid #1251f3;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 18.96px;
  padding-top: 6px;
  padding-bottom: 7px;
  padding-left: 24px;
  padding-right: 24px;
  background: white;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s all;

  &:hover {
    background-color: #6e7dff;
    color: #fff;
  }
`;

const SectionContainer = styled.div`
  width: 100%;
  padding: 40px 40px 34px 40px;
  box-shadow: 0px 4px 10px -1px rgba(0, 0, 0, 0.15);
  background-color: white;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  line-height: 19px;
  color: #1251f3;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  img {
    height: 15px;
    width: 15px;
    margin-left: 9px;
  }
`;

const Details = styled.div``;

const DatesAndSocial = styled.div`
  margin-top: 24px;
  display: grid;

  @media (min-width: 1024px) {
    gap: 25px;
    grid-template-columns: 2fr 1.25fr;
  }
`;

const Dates = styled.ul`
  width: 100%;
  padding: 0;
  margin: 0 0 20px;

  @media (min-width: 768px) {
    max-width: 420px;
  }
`;

const Date = styled.li`
  list-style: none;
`;

const DateText = styled.span`
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0em;
`;

const BoldDateText = styled(DateText)`
  font-weight: 700;
  margin-left: 17.5px;
`;

const SocialButtons = styled.div``;

const SocialContainer = styled(SectionContainer)`
  ${mobile} {
    margin-top: 20px;
  }
`;
