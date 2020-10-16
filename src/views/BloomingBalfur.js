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
  const [flowersCoords, setFlowerCoords] = useState([]);
  const [flowerCount, setFlowerCount] = useState(1);

  useEffect(() => {
    const coord = getRandomCoord({ maxX: 300, maxY: 480 });
    setFlowerCoords((prevState) => [...prevState, coord]);
  }, [flowerCount]);

  return (
    <BalfurWrapper>
      <Button onClick={() => setFlowerCount(flowerCount + 1)} style={{ width: '100%' }}>
        עוד פרח
      </Button>
      <StageWrapper width={360} height={500} options={{ backgroundColor: 0xeef1f5 }}>
        <Sprite image="/castle.png" width={100} height={100} x={140} y={200} />
        {flowersCoords.map((coord, index) => {
          const [x, y] = coord;
          return <Sprite width={30} height={30} x={x} y={y} image={'/flower.png'} key={index} />;
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
