import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaUsers, FaVectorSquare, FaSpinner, FaStar } from 'react-icons/fa';
import { getRecommendations } from '../../services/aiApi';

const RoomRecommendation = () => {
  const [form, setForm] = useState({ budget: '', guests: '', preferences: '' });
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setResults(null); setMessage('');
    try {
      const { data } = await getRecommendations(form);
      setResults(data.recommendations);
      if (data.message) setMessage(data.message);
    } catch {
      setMessage('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl overflow-hidden shadow-card">
      {/* Header banner */}
      <div className="bg-primary-900 px-7 py-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center flex-shrink-0">
            <FaRobot className="text-white text-sm" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-white">AI Room Recommendation</h2>
            <p className="text-slate-400 text-xs">Tell us your needs — our AI finds the perfect match</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white px-7 py-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Budget / night (₹)</label>
            <input type="number" min="1" required value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="e.g. 300" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Guests</label>
            <input type="number" min="1" required value={form.guests}
              onChange={e => setForm({ ...form, guests: e.target.value })}
              placeholder="e.g. 2" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Preferences (optional)</label>
            <input type="text" value={form.preferences}
              onChange={e => setForm({ ...form, preferences: e.target.value })}
              placeholder="sea view, spa, quiet..." className="input-field" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-secondary w-full py-3">
              {loading ? <><FaSpinner className="animate-spin" /> Finding...</> : <><FaRobot /> Get Picks</>}
            </button>
          </div>
        </form>

        {message && <p className="text-slate-400 text-sm text-center mt-4">{message}</p>}

        {results && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
            {results.map(({ room, reason }, i) => {
              const imageUrl = room.images?.[0]
                ? (room.images[0].startsWith('http') ? room.images[0] : `http://localhost:5000${room.images[0]}`)
                : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80';
              return (
                <div key={room._id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                  <div className="relative h-36 overflow-hidden">
                    <img src={imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-gold text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">
                      #{i + 1} Pick
                    </div>
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-primary-900 text-xs px-2.5 py-1 rounded-full font-bold shadow">
                      ₹{room.price?.toLocaleString('en-IN')}/night
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-primary-900 text-sm">{room.name}</h3>
                      <span className="badge bg-slate-100 text-slate-600 text-xs ml-1">{room.category || room.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs mb-3">
                      <span className="flex items-center gap-1"><FaUsers className="text-gold" />{room.capacity} guests</span>
                      <span className="flex items-center gap-1"><FaVectorSquare className="text-gold" />{room.size ? `${room.size} sq ft` : 'On Request'}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <FaStar className="text-gold text-xs mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed">{reason}</p>
                      </div>
                    </div>
                    <Link to={`/rooms/${room._id}`} className="block w-full text-center btn-primary py-2 text-xs">
                      View Room
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomRecommendation;
