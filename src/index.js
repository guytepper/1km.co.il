import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Detect android devies for device-specificissues
const html = document.querySelector('body');
if (navigator.userAgent.match(/android/i)) {
  html.classList.add('android-device');
}
