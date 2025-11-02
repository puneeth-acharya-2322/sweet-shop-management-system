// frontend/src/components/AddSweetForm.tsx

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// We create a prop to refresh the dashboard after adding
interface AddSweetFormProps {
  onSweetAdded: () => void;
}

export function AddSweetForm({ onSweetAdded }: AddSweetFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const newSweet = { name, category, price, quantity };
      await axios.post(`${API_BASE_URL}/sweets`, newSweet);

      // Clear the form
      setName('');
      setCategory('');
      setPrice(0);
      setQuantity(0);

      // Tell the dashboard to refresh
      onSweetAdded();
    } catch (err: any) {
      console.error('Failed to add sweet:', err);
      setError(err.response?.data?.message || 'Could not add sweet.');
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#3a3a3a', margin: '2rem 0' }}>
      <h3>Admin: Add New Sweet</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price ($):</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="0"
            required
          />
        </div>
        <button type="submit">Add Sweet</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}