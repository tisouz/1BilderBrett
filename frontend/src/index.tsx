import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './app/store';
import './index.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>,
  document.getElementById('root')
);

//Register service worker
serviceWorkerRegistration.register();