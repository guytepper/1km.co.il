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

/* Detect android devies for device-specificissues
const html = document.querySelector('body');
if (navigator.userAgent.match(/android/i)) {
  html.classList.add('android-device');
}*/
