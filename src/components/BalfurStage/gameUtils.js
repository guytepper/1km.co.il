export function getRandomNumber({ max }) {
  return Math.floor(Math.random() * max) + 1;
}

export function getRandomLen({ min, max }) {
  /* the '^2' is for getting more results close to the castle*/
  return Math.floor(Math.pow(Math.random(), 2) * (max - min)) + min + 1;
}

/*=============================
Calculate a position in the "garden"
minLen , maxLen : 
-----the distance from the castle is deteminated by a random number (between minLen - maxLen)
behindCastle:
------this is a boolean, if it's false the position returned will defently not be behind the castle.
===========================*/
export function getRandomCoord(stageInfo) {
  const { castleX, castleY, castleWidth, castleHeight, ellipseWidth, minLength, maxLength, behindCastle } = stageInfo;
  /* Offset from origin of castle*/
  const positionOffset = 23;
  /***Origin point of castle ***/
  var cX = castleX + 0.5 * castleWidth + positionOffset;
  var cY = castleY + 0.5 * castleHeight - positionOffset;

  /***======Random numbers for every flower=======***/
  /*==Random angle from origin (number between 0-360)==*/
  var angle = Math.random() * 10;

  /*==len from origin==*/
  var len = getRandomLen({ max: maxLength, min: minLength });

  /**** calc ellipse***/
  var y1 = -cY + Math.sin(angle) * len;
  var x1 = -cX + ellipseWidth * Math.cos(angle) * len;

  /***rotate ellipse***/
  var rotAngle = -60;

  /** the final result**/
  var x = x1 * Math.cos(rotAngle) + y1 * Math.sin(rotAngle);
  var y = -x1 * Math.sin(rotAngle) + y1 * Math.cos(rotAngle);

  /* If object isnt suppose to be behind castle -> recalculate position*/
  if (!behindCastle && x > castleX - 15 && x < castleX + castleWidth && y > castleY && y < castleY + castleHeight)
    [x, y] = getRandomCoord(stageInfo);

  return [x, y];
}
