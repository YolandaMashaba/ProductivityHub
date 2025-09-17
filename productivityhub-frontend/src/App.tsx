import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <div className="App">
      {!isLoggedIn ? <Login /> : <Dashboard />}
    </div>
  );
}

export default App;