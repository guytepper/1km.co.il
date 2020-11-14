import React from 'react';
import * as S from './ProtestInfo.style';
import * as utils from '../../utils';
import { ProtestCardInfo, ProtestCardDetail, ProtestCardIcon } from '../../components/ProtestCard/ProtestCardStyles';

function ProtestInfo({ coordinates, displayName, streetAddress, userCoordinates, notes }) {
  return (
    <S.Info>
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
  );
}

export default ProtestInfo;
