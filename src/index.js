import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import heIL from 'antd/lib/locale/he_IL';
import './index.css';
import { StoreProvider } from './stores';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <ConfigProvider locale={heIL} direction="rtl">
        <Router>
          <App />
        </Router>
      </ConfigProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

/* Detect browsers for specific issues fixes */
const isSafari =
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') === -1 &&
  navigator.userAgent.indexOf('FxiOS') === -1;

const isAndroid = /Android/i.test(navigator.userAgent);
const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
const isChromeAndroid = isAndroid && isChrome;

const html = document.querySelector('body');

if (isSafari) {
  html.classList.add('safari');
  html.classList.add('grid-max-content-nosupport');
}

if (isChromeAndroid) {
  html.classList.add('chrome-android');
  html.classList.add('grid-max-content-nosupport');
}
