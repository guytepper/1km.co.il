import React from 'react';

function SafeRender({ validObj }) {
  return validObj && { children };
}

export default SafeRender;
