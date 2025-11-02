// frontend/src/components/Dashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AddSweetForm } from './AddSweetForm';
import { Navbar } from './Navbar'; // <-- 1. Import Navbar

// ... (Sweet interface is the same) ...
interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const API_BASE_URL = 'http://localhost:3000/api';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const fetchSweets = useCallback(async (params = {}) => {
    try {
      const endpoint = Object.keys(params).length ? '/sweets/search' : '/sweets';
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
      setSweets(response.data);
    } catch (err: any) {
      console.error('Failed to fetch sweets:', err);
      setError(err.response?.data?.message || 'Could not load sweets.');
      if (err.response?.status === 401) {
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  // ... (handlePurchase, handleDelete, handleRestock are unchanged) ...
  const handlePurchase = async (sweetId: string) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/sweets/${sweetId}/purchase`);
      const updatedSweet = response.data;
      setSweets(currentSweets =>
        currentSweets.map(sweet =>
          sweet._id === sweetId ? updatedSweet : sweet
        )
      );
    } catch (err: any) {
      console.error('Purchase failed:', err);
      setError(err.response?.data?.message || 'Purchase failed.');
    }
  };
  const handleDelete = async (sweetId: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/sweets/${sweetId}`);
      setSweets(currentSweets =>
        currentSweets.filter(sweet => sweet._id !== sweetId)
      );
    } catch (err: any) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };
  const handleRestock = async (sweetId: string) => {
    const amountStr = window.prompt('How many to add to stock?');
    if (!amountStr) return;
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid, positive number.');
      return;
    }
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/sweets/${sweetId}/restock`, {
        quantity: amount,
      });
      const updatedSweet = response.data;
      setSweets(currentSweets =>
        currentSweets.map(sweet =>
          sweet._id === sweetId ? updatedSweet : sweet
        )
      );
    } catch (err: any) {
      console.error('Restock failed:', err);
      setError(err.response?.data?.message || 'Restock failed.');
    }
  };
  // --- End of unchanged functions ---

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const params: any = {};
    if (searchName) params.name = searchName;
    if (searchCategory) params.category = searchCategory;
    fetchSweets(params);
  };

  return (
    <> {/* <-- Use a Fragment */}
      <Navbar /> {/* <-- 2. Add the Navbar here */}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {user?.role === 'admin' && (
          // Update AddSweetForm to use new styles
          <div className="admin-section">
            <AddSweetForm onSweetAdded={() => fetchSweets()} />
          </div>
        )}

        <div className="search-section">
          <h3>Search Sweets</h3>
          <form onSubmit={handleSearch} style={{ flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
            <div>
              <label htmlFor="searchName">Name:</label>
              <input
                type="text"
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="searchCategory">Category:</label>
              <input
                type="text"
                id="searchCategory"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Search</button>
          </form>
        </div>

        <h2>Sweets Dashboard</h2>
        {error && <p className="error">{error}</p>}

        {/* --- 3. Update the product grid --- */}
        <div className="product-grid">
          {sweets.map((sweet) => (
            <div className="product-card" key={sweet._id}>
              <div className="card-image-placeholder">
                (Image Placeholder)
              </div>
              <div className="card-body">
                <h3>{sweet.name}</h3>
                <p className="category">{sweet.category}</p>
                <p className="price">${sweet.price.toFixed(2)}</p>
                <p className="card-stock">
                  {sweet.quantity > 0 ? (
                    <span className="in-stock">{sweet.quantity} in stock</span>
                  ) : (
                    <span className="out-of-stock">Out of stock</span>
                  )}
                </p>
                
                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handlePurchase(sweet._id)}
                    disabled={sweet.quantity === 0}
                  >
                    Purchase
                  </button>

                  {user?.role === 'admin' && (
                    <div className="admin-actions">
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleRestock(sweet._id)}
                      >
                        Restock
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(sweet._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}