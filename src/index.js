import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/config/configureStore';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

//const history = createHistory();

render(
  <Router>
    <App store={store} {...this.props} />
  </Router>,
  document.getElementById('root'));
//registerServiceWorker();
