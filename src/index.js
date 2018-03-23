import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from './store/config/configureStore';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

render(
  <Router>
    <App store={store} {...this.props} />
  </Router>,
  document.getElementById('root'));
//registerServiceWorker();
