import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { primaryColor, bgColor, darkColor, lightColor, highlightBg, secondaryTextColor, successColor } from './constants/colors';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          colorLink: primaryColor,
          colorSuccess: successColor,
          colorTextHeading: lightColor,
          colorTextBase: lightColor,
          colorTextBody: lightColor,
          colorTextSecondary: secondaryTextColor,
          colorIcon: primaryColor,
          colorIconHover: highlightBg,
          colorBgBase: bgColor,
          colorBgLayout: bgColor,
        },
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
