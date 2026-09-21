import { useState } from 'react';
import { FaSearch, FaSlidersH, FaTimes } from 'react-icons/fa';

const CATEGORIES = ['Single', 'Double', 'Deluxe', 'Suite', 'Presidential'];

const RoomFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', capacity: '', search: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => { e.preventDefault(); onFilter(filters); };

  const handleReset = () => {
    const empty = { category: '', minPrice: '', maxPrice: '', capacity: '', search: '' };
    setFilters(empty);
    onFilter(empty);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 mb-8">
      <form onSubmit={handleSubmit}>
        {/* Main row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              name="search"
              placeholder="Search rooms..."
              value={filters.search}
              onChange={handleChange}
              className="input-field pl-10"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => { setFilters(p => ({ ...p, category: '' })); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
                ${!filters.category ? 'bg-primary-900 text-white border-primary-900' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-900'}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilters(p => ({ ...p, category: p.category === cat ? '' : cat }))}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
                  ${filters.category === cat ? 'bg-primary-900 text-white border-primary-900' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(o => !o)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                ${showAdvanced ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              <FaSlidersH /> Filters
            </button>
            <button type="submit" className="btn-primary py-2.5 px-5 text-sm">Search</button>
            {hasFilters && (
              <button type="button" onClick={handleReset}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all">
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Min Price (₹)</label>
              <input type="number" name="minPrice" placeholder="0" value={filters.minPrice} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Max Price (₹)</label>
              <input type="number" name="maxPrice" placeholder="1000" value={filters.maxPrice} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Min Guests</label>
              <input type="number" name="capacity" placeholder="1" value={filters.capacity} onChange={handleChange} className="input-field" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RoomFilter;
