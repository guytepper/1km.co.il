import React from 'react';

function ProtestDates({ latestPictures, userStore }) {
  return (
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
          <S.EditButton onClick={() => history.push(`${history.location.pathname}/gallery`)}>לצפייה בגלריית ההפגנה</S.EditButton>
        </>
      ) : (
        <>
          <p>עדיין לא העלו תמונות להפגנה הזו.</p>
          <S.EditButton
            onClick={() => {
              userStore.setUserProtest(protest);
              history.push(
                userStore.user
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
  );
}

export default ProtestDates;
