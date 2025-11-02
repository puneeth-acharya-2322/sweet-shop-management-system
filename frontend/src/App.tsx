// frontend/src/App.tsx

import React, { useState } from 'react'; // <-- 1. Import useState
import { Login } from './components/Login';
import { Register } from './components/Register'; // <-- 2. Import Register
import { Dashboard } from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true); // <-- 3. Add state to toggle

  // If the user is logged in, show the dashboard
  if (user) {
    return <Dashboard />;
  }

  // If logged out, show Login or Register
  if (showLogin) {
    return <Login onShowRegister={() => setShowLogin(false)} />;
  } else {
    return <Register onShowLogin={() => setShowLogin(true)} />;
  }
}

export default App;