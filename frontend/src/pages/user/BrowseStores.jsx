import { useEffect, useState } from 'react';
import client from '../../api/client';
import StarRating from '../../components/StarRating';

export default function BrowseStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  async function loadStores() {
    try {
      const params = {};
      if (search.name) params.name = search.name;
      if (search.address) params.address = search.address;
      const res = await client.get('/stores', { params });
      setStores(res.data.stores);
    } catch {
      setError('Could not load stores.');
    }
  }

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadStores();
  }

  async function handleRate(storeId, rating) {
    setSavingId(storeId);
    try {
      await client.post(`/stores/${storeId}/ratings`, { rating });
      setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, myRating: rating } : s)));
    } catch {
      setError('Could not save your rating. Please try again.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Stores</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="filter-bar" onSubmit={handleSearchSubmit}>
        <input
          className="input"
          placeholder="Search by name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Search by address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
        <button className="btn btn-secondary" type="submit">
          Search
        </button>
      </form>

      <div className="store-grid">
        {stores.length === 0 && <p className="empty-state">No stores match your search.</p>}
        {stores.map((store) => (
          <div className="card store-card" key={store.id}>
            <h2 className="card-title">{store.name}</h2>
            <p className="store-address">{store.address}</p>

            <div className="store-rating-row">
              <span className="label">Overall</span>
              {store.overallRating ? (
                <StarRating value={Number(store.overallRating)} readOnly size={16} />
              ) : (
                <span className="hint">No ratings yet</span>
              )}
            </div>

            <div className="store-rating-row">
              <span className="label">Your rating</span>
              <StarRating value={store.myRating || 0} onChange={(n) => handleRate(store.id, n)} size={20} />
              {savingId === store.id && <span className="hint">Saving…</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
