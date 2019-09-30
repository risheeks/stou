import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './components/Register';
import './styles/Main.css';
import Login from './components/Login';
import Home from './components/Home';
import Header from './components/Common/Header';


function App() {
  return (
    <div className="App">
      <Header />
      <Home />
    </div>
  );
}

export default App;
