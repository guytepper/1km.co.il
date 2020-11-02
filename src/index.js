import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import heIL from 'antd/lib/locale/he_IL';
import './index.css';
import { StoreProvider } from './stores';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <ConfigProvider locale={heIL} direction="rtl">
        <App />
      </ConfigProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

/* Detect Safari for browser specific issues */
const isSafari =
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') === -1 &&
  navigator.userAgent.indexOf('FxiOS') === -1;

if (isSafari) {
  const html = document.querySelector('body');
  html.classList.add('safari');
}
