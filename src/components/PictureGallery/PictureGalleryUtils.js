/**
 * Get a Picture array - first one of each date.
 * @param {Picture[]} pictures - An array of picture objects.
 * @returns {Picture[]} - one for of each date
 */
export function getGalleryThumbnails(pictures) {
  const uniqueDates = [];
  const galleryThumbnails = [];
  pictures.forEach((picture) => {
    if (!uniqueDates.includes(picture.eventDate)) {
      uniqueDates.push(picture.eventDate);
      galleryThumbnails.push(picture);
    }
  });

  return galleryThumbnails;
}

/**
 * Get a Picture array for specific date.
 * @param {Picture[]} pictures - An array of picture objects.
 * @param {string} date - For the date you want - format YYYY-MM-DD.
 * @returns {Picture[]} - All the picture of the date.
 */
export function getPicturesForDate(pictures, date) {
  return pictures.filter((picture) => picture.eventDate === date);
}
