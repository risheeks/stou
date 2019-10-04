import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './components/Register';
import './styles/Main.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import Header from './components/Common/Header';
import AddFoodItem from './components/AddFoodItem';
import Profile from './components/Profile';
import ViewFoodOptions from './components/ViewFoodOptions';


function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <ViewFoodOptions/>
        <Route exact={true} path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/addfood" component={AddFoodItem} />
        <Route path="/profile" component={Profile} />
      </Router>
    </div>
  );
}

export default App;
