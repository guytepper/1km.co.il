import React, { useEffect, useState, useRef } from 'react';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import * as S from './ProtestPage.style';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as api from '../../api';
import { Marker, Polyline, TileLayer } from 'react-leaflet';
import { ProtectedRoute, ProtestForm, PictureGallery } from '../../components';
import * as utils from '../../utils';
import {
  ProtestCardDetail,
  ProtestCardGroupButton,
  ProtestCardIcon,
  ProtestCardInfo,
} from '../../components/ProtestCard/ProtestCardStyles';

function getEditButtonLink(user, protest) {
  const editRoute = `/protest/${protest.id}/edit`;

  if (utils.isAdmin(user) || utils.isAuthenticated(user)) {
    return editRoute;
  }

  if (utils.isVisitor(user)) {
    // Sign up before redirected to leader request
    return `/sign-up?returnUrl=${editRoute}`;
  }

  throw new Error(`couldn't find route`);
}

async function _fetchProtest(id, setProtest) {
  const protest = await api.fetchProtest(id);

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
          dateTimeList: utils.sortDateTimeList(protest.dateTimeList),
        }
      : null,
    setProtest,
  };
}

function getFutureDates(dateTimeList) {
  if (dateTimeList?.length) {
    return dateTimeList.filter((dateTime) => {
      const now = new Date();
      const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      const protestDate = new Date(dateTime.date);
      const protestDay = new Date(Date.UTC(protestDate.getUTCFullYear(), protestDate.getUTCMonth(), protestDate.getUTCDate()));

      return protestDay >= today;
    });
  }
  return [];
}

function ProtestPageContent({ protest, user, userCoordinates }) {
  const history = useHistory();
  const mapElement = useRef(null);
  const polylineElement = useRef(null);
  const [polyPositions, setPolyPositions] = useState([]);
  const { coordinates, displayName, streetAddress, notes, dateTimeList } = protest;
  const [latestPictures, setLatestPictures] = useState([]);
  const galleryMatch = useRouteMatch('/protest/:id/gallery');
  const galleryDateMatch = useRouteMatch('/protest/:id/gallery/:date');
  const store = useStore();

  useEffect(() => {
    async function getLatestPictures() {
      const pictures = await api.getLatestProtestPictures(protest.id);
      setLatestPictures(pictures);
    }

    getLatestPictures();
  }, [protest]);

  useEffect(() => {
    if (protest.positions?.length > 0) {
      const polyPositions = protest.positions.map((p) => [p.latlng.latitude, p.latlng.longitude]);
      setPolyPositions(polyPositions);
    }
  }, [protest]);

  useEffect(() => {
    if (polyPositions.length > 0 && polylineElement.current) {
      const polyBounds = polylineElement.current.leafletElement.getBounds();
      mapElement.current.leafletElement.flyToBounds(polyBounds);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polyPositions]);

  const futureDates = getFutureDates(dateTimeList);

  return (
    <S.ProtestPageContainer>
      <S.MapWrapper center={{ lat: coordinates.latitude, lng: coordinates.longitude }} zoom={14} ref={mapElement}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={{ lat: coordinates.latitude, lng: coordinates.longitude }}></Marker>
        {polyPositions.length > 0 && (
          <>
            <Polyline ref={polylineElement} positions={polyPositions} />
            {polyPositions.map((position) => (
              <Marker position={{ lat: position[0], lng: position[1] }} key={position[0]}></Marker>
            ))}
          </>
        )}
      </S.MapWrapper>

      <S.ProtestContainer>
        S.{' '}
        <S.Info>
          {/* <ProfilePic src="/protest-profile-pic.png" alt="Protester with flag getting sprayed" /> */}
          <S.Details>
            <S.Title>{displayName}</S.Title>
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
                  {utils.formatDistance(utils.calculateDistance(userCoordinates, [coordinates.latitude, coordinates.longitude]))}
                </ProtestCardDetail>
              )}
              {notes && <ProtestCardDetail style={{ textAlign: 'center' }}>{notes}</ProtestCardDetail>}
            </ProtestCardInfo>
          </S.Details>
        </S.Info>
        {galleryMatch?.isExact || galleryDateMatch?.isExact ? (
          <PictureGallery protestId={protest.id} />
        ) : (
          <>
            <S.SectionContainer style={{ marginTop: 20 }}>
              <S.SectionTitle>
                <img src="/icons/photo-gallery-blueish.svg" alt="" />
                תמונות אחרונות מההפגנה
              </S.SectionTitle>

              {latestPictures.length > 0 ? (
                <>
                  <S.LatestPicturesWrapper>
                    {latestPictures.map((picture) => (
                      <S.PictureThumbnail src={picture.imageUrl} alt="" key={picture.id} />
                    ))}
                  </S.LatestPicturesWrapper>
                  <S.EditButton onClick={() => history.push(`${history.location.pathname}/gallery`)}>
                    לצפייה בגלריית ההפגנה
                  </S.EditButton>
                </>
              ) : (
                <>
                  <p>עדיין לא העלו תמונות להפגנה הזו.</p>
                  <S.EditButton
                    onClick={() => {
                      store.userStore.setUserProtest(protest);
                      history.push(
                        store.userStore.user
                          ? `/upload-image?returnUrl=${history.location.pathname}`
                          : `/sign-up?returnUrl=/upload-image?returnUrl=${history.location.pathname}`
                      );
                    }}
                  >
                    היו ראשונים להעלות תמונה!
                  </S.EditButton>
                </>
              )}
            </S.SectionContainer>
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
          </>
        )}
      </S.ProtestContainer>
    </S.ProtestPageContainer>
  );
}

function ProtestPage() {
  const { protest, setProtest } = useFetchProtest();
  const store = useStore();
  const history = useHistory();
  const { user } = store.userStore;

  // const { onFileUpload } = useFileUpload(false);
  if (!protest) {
    // TODO: loading state
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '25px 0' }}>
        <p style={{ fontSize: 17 }}>טוען ...</p>
        <LoadingSpinner />
      </div>
    );
  }

  const { coordinates, id: protestId } = protest;
  const canEdit = !utils.isVisitor(user);

  return (
    <Switch>
      <ProtectedRoute path="/protest/:id/edit" authorized={canEdit}>
        <S.EditViewContainer>
          <ProtestForm
            initialCoords={[coordinates.latitude, coordinates.longitude]}
            submitCallback={async (params) => {
              // If the user is not a leader for this protest, check if they've reached the amount of protests limit.
              if (!protest.roles?.leader.includes(user.uid) && !utils.isAdmin(user)) {
                const userProtests = await api.getProtestsForLeader(user.uid);

                if (userProtests.length > 4) {
                  alert('לא ניתן לערוך מידע על יותר מ- 5 הפגנות.\n צרו איתנו קשר אם ישנו צורך לערוך הפגנות מעבר למכסה.');
                  throw new Error('Reached the max amount of protests a user can lead');
                }

                await api.sendProtestLeaderRequest(user, null, protestId);
                await api.makeUserProtestLeader(protestId, user.uid);
              }

              const response = await api.updateProtest({ protestId, params, userId: user.uid });

              // Refetch the protest once update is complete
              _fetchProtest(protestId, setProtest);

              return response;
            }}
            afterSubmitCallback={() => history.push(`/protest/${protestId}`)}
            defaultValues={protest}
            editMode={true}
            isAdmin={utils.isAdmin(user)}
          />
        </S.EditViewContainer>
      </ProtectedRoute>
      <Route>
        <ProtestPageContent protest={protest} userCoordinates={store.userCoordinates} user={user} />
      </Route>
    </Switch>
  );
}

export default observer(ProtestPage);
