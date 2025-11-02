// frontend/src/components/Navbar.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">
        SweetShop
      </div>
      <div className="user-info">
        <span>
          Welcome, {user?.username}
          {user?.role === 'admin' && <span className="role-admin"> (Admin)</span>}
        </span>
        <button onClick={logout} className="btn btn-secondary">
          Logout
        </button>
      </div>
    </nav>
  );
}