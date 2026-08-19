import { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/items');
      if (!res.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await res.json();
      setItems(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not fetch items. Make sure backend is running and MongoDB is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle item submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to create item');
      }

      const newItem = await res.json();
      setItems([newItem, ...items]);
      setName('');
      setDescription('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not add item.');
    }
  };

  // Handle item deletion
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete item');
      }

      setItems(items.filter((item) => item._id !== id));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not delete item.');
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Item Manager</h1>
        <p className="subtitle">Simple MERN Stack Test Application</p>
      </header>

      {error && <div className="alert-error">{error}</div>}

      <div className="layout">
        {/* Form Section */}
        <section className="card form-section">
          <h2>Add New Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Item Name *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Buy groceries"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Milk, Eggs, Bread"
                rows="3"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              Add Item
            </button>
          </form>
        </section>

        {/* List Section */}
        <section className="card list-section">
          <h2>Items List ({items.length})</h2>
          
          {loading ? (
            <p className="loading">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="empty-state">No items found. Add some using the form!</p>
          ) : (
            <ul className="item-list">
              {items.map((item) => (
                <li key={item._id} className="item-card">
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                    <span className="timestamp">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="btn-danger"
                    aria-label={`Delete ${item.name}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
