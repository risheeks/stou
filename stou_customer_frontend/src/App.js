import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/Main.css';
import Main from './components/Main';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';

const rootStore = createStore(rootReducer);

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
