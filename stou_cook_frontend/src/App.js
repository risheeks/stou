import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/Main.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import Header from './components/Common/Header';


function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Route exact={true} path="/" component={Home} />
        <Route path="/login" component={Login} />
      </Router>
    </div>
  );
}

export default App;
