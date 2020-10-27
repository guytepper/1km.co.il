import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { StoreProvider } from './stores';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

/* Detect android devies for device-specificissues
const html = document.querySelector('body');
if (navigator.userAgent.match(/android/i)) {
  html.classList.add('android-device');
}*/
