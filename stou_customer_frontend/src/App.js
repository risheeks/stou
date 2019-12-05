import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/Main.css';
import Main from './components/Main';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
// import * as Sentry from '@sentry/browser';]
import Raven from 'raven-js';

const rootStore = createStore(rootReducer, applyMiddleware(thunk));
// Sentry.init({dsn: "https://433cfd8d96d647c49228ed7b0f47ed95@sentry.io/1845882"});
Raven.config('https://433cfd8d96d647c49228ed7b0f47ed95@sentry.io/1845882').install()
function App() {
  return (
    <div className="App">
      <Provider store={rootStore}>
        <Main />
      </Provider>
    </div>
  );
}

export default App;
