import React, { useState, useEffect } from 'react';
import { Button } from '../components';
import firebase, { realtimeDB } from '../firebase';
import { PixiComponent, Stage, Sprite, Container } from '@inlet/react-pixi';
import styled from 'styled-components/macro';

const castleX = 100,
  castleY = 30,
  cWidth = 150,
  cHeight = 150,
  ellipseWidth = 2.5; /* this number express the width of the ellipse*/

function getRandomNumber({ max }) {
  return Math.floor(Math.random() * max) + 1;
}
function getRandomLen({ min, max }) {
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
function getRandomCoord({ minLen, maxLen, behindCastle }) {
  /* Offset from origin of castle*/
  const positionOffset = 23;
  /***Origin point of castle ***/
  var cX = castleX + 0.5 * cWidth + positionOffset;
  var cY = castleY + 0.5 * cHeight - positionOffset;

  /***======Random numbers for every flower=======***/
  /*==Random angle from origin (number between 0-360)==*/
  var angle = Math.random() * 10;

  /*==len from origin==*/
  var len = getRandomLen({ max: maxLen, min: minLen });

  /**** calc ellipse***/
  var y1 = -cY + Math.sin(angle) * len;
  var x1 = -cX + ellipseWidth * Math.cos(angle) * len;

  /***rotate ellipse***/
  var rotAngle = -60;

  /** the final result**/
  var x = x1 * Math.cos(rotAngle) + y1 * Math.sin(rotAngle);
  var y = -x1 * Math.sin(rotAngle) + y1 * Math.cos(rotAngle);

  /*If object isnt suppose to be behind castle -> recalculate position*/
  if (!behindCastle && x > castleX - 15 && x < castleX + cWidth && y > castleY && y < castleY + cHeight)
    [x, y] = getRandomCoord({ minLen: minLen, macLen: maxLen });

  return [x, y];
}

export default function BloomingBalfur() {
  /* Array of throns that won't transform to flowers*/
  const [onlythronsList, updateonlyThronsList] = useState(() =>
    new Array(1000).fill([0, 0]).map(() => ({
      bloomed: false,
      position: getRandomCoord({ minLen: 0, maxLen: 50, behindCastle: true }),
    }))
  );
  /* Array of throns that will transform to flowers*/
  const [thronsList, updateThronsList] = useState(() =>
    new Array(1000).fill([0, 0]).map(() => ({
      bloomed: false,
      position: getRandomCoord({ minLen: 35, maxLen: 65, behindCastle: false }),
    }))
  );

  const [flowerCount, setFlowerCount] = useState(1);

  useEffect(() => {
    // Look for a thron that hasn't bloomed to be a flower
    let foundThron = false;
    while (!foundThron) {
      const index = getRandomNumber({ max: thronsList.length - 1 });
      if (!thronsList[index].bloomed) {
        let list = [...thronsList];
        let item = { ...list[index], bloomed: true };
        list[index] = item;
        updateThronsList(list);
        foundThron = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowerCount]);

  useEffect(() => {
    const flowerCount = realtimeDB.ref('flowers_count');
    flowerCount.on('value', (snapshot) => {
      console.log('Realtime Database Update: ' + snapshot.val());
      setFlowerCount(snapshot.val());
    });
  }, []);

  const addFlower = () => {
    realtimeDB.ref('flowers_count').set(firebase.database.ServerValue.increment(1));
  };

  return (
    <BalfurWrapper>
      <Button style={{ width: '100%' }}> פרחים: {flowerCount}</Button>
      <StageWrapper width={360} height={500} options={{ backgroundColor: 0xeef1f5 }} sortableChildren={true}>
        <Container position={[0, 0]} sortableChildren={true}>
          <Sprite image="/castle.png" width={cWidth} height={cHeight} x={castleX} y={castleY} zIndex={20} />
          {thronsList.concat(onlythronsList).map((thron, index) => {
            const [x, y] = thron.position;
            return (
              <Sprite
                image={thron.bloomed ? '/flower.png' : '/throns.png'}
                width={20}
                height={20}
                x={x}
                y={y}
                key={index}
                zIndex={thron.bloomed ? 200 : 1}
              />
            );
          })}
        </Container>
      </StageWrapper>
      <Button onClick={() => addFlower()} style={{ width: '100%' }}>
        עוד פרח
      </Button>
    </BalfurWrapper>
  );
}

const BalfurWrapper = styled.div`
  margin: 0 auto;
`;

const StageWrapper = styled(Stage)`
  /* margin: 25px; */
`;
