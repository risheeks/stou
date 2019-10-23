import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/Main.css';
import Main from './components/Main';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const rootStore = createStore(rootReducer, applyMiddleware(thunk));

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
