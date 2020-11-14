import React, { useEffect, useState, useRef } from 'react';
import { Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import * as api from '../../api';
import * as utils from '../../utils';
import { useStore } from '../../stores';
import * as S from './ProtestPage.style';
import ProtestLatestPictures from './ProtestLatestPictures';
import {
  ProtectedRoute,
  ProtestForm,
  PictureGallery,
  ProtestMap,
  ProtestInfo,
  ProtestDates,
  LoadingSpinner,
  ProtestLatestPictures,
} from '../../components';

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
      <ProtestMap
        coordinates={coordinates}
        mapElement={mapElement}
        polylineElement={polylineElement}
        polyPositions={polyPositions}
      />

      <S.ProtestContainer>
        <ProtestInfo
          coordinates={coordinates}
          displayName={displayName}
          streetAddress={streetAddress}
          userCoordinates={userCoordinates}
          notes={notes}
        />
        {galleryMatch?.isExact || galleryDateMatch?.isExact ? (
          <PictureGallery protestId={protest.id} />
        ) : (
          <>
            <ProtestDates history={history} latestPictures={latestPictures} userStore={user.userStore} />
            <ProtestLatestPictures protest={protest} futureDates={futureDates} user={user} />
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
  const handleSubmit = async (params) => {
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
  };

  return (
    <Switch>
      <ProtectedRoute path="/protest/:id/edit" authorized={canEdit}>
        <S.EditViewContainer>
          <ProtestForm
            initialCoords={[coordinates.latitude, coordinates.longitude]}
            submitCallback={(params) => handleSubmit(params)}
            afterSubmitCallback={() => history.push(`/protest/${protestId}`)}
            defaultValues={protest}
            editMode={true}
            isAdmin={utils.isAdmin(user)}
          />
        </S.EditViewContainer>
      </ProtectedRoute>

      <ProtestPageContent protest={protest} userCoordinates={store.userCoordinates} user={user} />
    </Switch>
  );
}

export default observer(ProtestPage);
