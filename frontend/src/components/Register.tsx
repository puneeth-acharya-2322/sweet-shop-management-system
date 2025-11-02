// frontend/src/components/Register.tsx
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/register';

interface RegisterProps {
  onShowLogin: () => void;
}

export function Register({ onShowLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post(API_URL, { username, password });
      setSuccess('Registration successful! Please log in.');
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="form-container"> {/* <-- Use new class */}
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
      <button onClick={onShowLogin} className="btn-link" style={{marginTop: '1rem'}}>
        Back to Login
      </button>
    </div>
  );
}