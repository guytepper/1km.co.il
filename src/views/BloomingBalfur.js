import React, { useState, useEffect } from 'react';
import { Button } from '../components';
import { PixiComponent, Stage, Sprite } from '@inlet/react-pixi';
import styled from 'styled-components/macro';

function getRandomNumber({ max }) {
  return Math.floor(Math.random() * max) + 1;
}
function getRandomCoord({ maxX, maxY }) {
  return [getRandomNumber({ max: maxX }), getRandomNumber({ max: maxY })];
}

export default function BloomingBalfur() {
  const [thronsList, updateThronsList] = useState(() =>
    new Array(50).fill([0, 0]).map(() => ({ bloomed: false, position: getRandomCoord({ maxX: 300, maxY: 480 }) }))
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
        console.log(item, index, list);
        foundThron = true;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowerCount]);

  return (
    <BalfurWrapper>
      <Button onClick={() => setFlowerCount(flowerCount + 1)} style={{ width: '100%' }}>
        עוד פרח
      </Button>
      <StageWrapper width={360} height={500} options={{ backgroundColor: 0xeef1f5 }}>
        <Sprite image="/castle.png" width={150} height={150} x={220} y={10} />
        {thronsList.map((thron, index) => {
          const [x, y] = thron.position;
          return <Sprite image={thron.bloomed ? '/flower.png' : '/throns.png'} width={20} height={20} x={x} y={y} key={index} />;
        })}
      </StageWrapper>
    </BalfurWrapper>
  );
}

const BalfurWrapper = styled.div`
  margin: 0 auto;
`;

const StageWrapper = styled(Stage)`
  /* margin: 25px; */
`;
