import React from 'react';
import ReactDOM from 'react-dom';

import ContextProvider from './context';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

import './index.scss';

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('root') as HTMLElement,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
