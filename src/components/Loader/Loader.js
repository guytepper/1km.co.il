import React from 'react';

function Loader({ imgSrc, style = {} }) {
  const spinnerSrc = 'icons/loading-spinner.svg';
  return <img alt={'loading'} src={imgSrc || spinnerSrc} style={style} />;
}

export default Loader;
