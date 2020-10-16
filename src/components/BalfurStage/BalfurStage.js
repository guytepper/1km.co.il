import React, { useState, useEffect } from 'react';
import { Stage, Sprite, Container } from '@inlet/react-pixi';
import styled from 'styled-components/macro';
import { getRandomCoord, getRandomNumber } from './gameUtils';

const castleInfo = {
  castleX: 100,
  castleY: 30,
  castleWidth: 150,
  castleHeight: 150,
  ellipseWidth: 2.5,
};

const staticThrons = new Array(1000).fill([0, 0]).map(() => ({
  bloomed: false,
  position: getRandomCoord({ ...castleInfo, minLength: 0, maxLength: 50, behindCastle: true }),
}));

export default function BalfurStage({ flowerCount }) {
  /* Array of throns that will transform to flowers*/
  const [thronsList, updateThronsList] = useState(() =>
    new Array(1000).fill([0, 0]).map(() => ({
      bloomed: false,
      position: getRandomCoord({ ...castleInfo, minLength: 35, maxLength: 65, behindCastle: false }),
    }))
  );

  useEffect(() => {
    // Look for a thron that hasn't bloomed and turn it to a flower
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

  return (
    <StageWrapper width={360} height={500} options={{ backgroundColor: 0xeef1f5 }}>
      <Container position={[0, 0]} sortableChildren={true}>
        <Sprite
          image="/castle.png"
          width={castleInfo.castleWidth}
          height={castleInfo.castleHeight}
          x={castleInfo.castleX}
          y={castleInfo.castleY}
          zIndex={20}
        />
        {thronsList.concat(staticThrons).map((thron, index) => {
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
  );
}

const StageWrapper = styled(Stage)`
  /* margin: 25px; */
`;
