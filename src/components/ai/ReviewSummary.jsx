import { useState } from 'react';
import { FaRobot, FaThumbsUp, FaThumbsDown, FaStar, FaSpinner, FaPlus, FaTimes, FaQuoteLeft } from 'react-icons/fa';
import { getReviewSummary } from '../../services/aiApi';

const SAMPLE_REVIEWS = [
  "Amazing room with stunning views! The bed was super comfortable and staff were very helpful.",
  "Great location and clean rooms. Check-in was smooth. Would definitely come back.",
  "The room was nice but the WiFi was a bit slow. Breakfast was excellent though.",
  "Loved the spa and pool facilities. Room service was prompt and food was delicious.",
  "Slightly noisy at night due to nearby construction. Otherwise a pleasant stay."
];

const ReviewSummary = () => {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [newReview, setNewReview] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addReview = () => {
    if (newReview.trim()) { setReviews(p => [...p, newReview.trim()]); setNewReview(''); }
  };

  const handleSummarize = async () => {
    if (!reviews.length) return;
    setLoading(true); setSummary(null); setError('');
    try {
      const { data } = await getReviewSummary(reviews);
      setSummary(data.summary);
    } catch { setError('Failed to generate summary. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary-900 px-7 py-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center flex-shrink-0">
          <FaStar className="text-white text-sm" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-white">AI Review Summary</h2>
          <p className="text-slate-400 text-xs">AI analyzes guest reviews and highlights key insights</p>
        </div>
      </div>

      <div className="p-7">
        {/* Reviews list */}
        <div className="mb-5 space-y-2 max-h-44 overflow-y-auto pr-1">
          {reviews.map((review, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3 group">
              <FaQuoteLeft className="text-gold text-xs mt-0.5 flex-shrink-0" />
              <p className="flex-1 text-slate-600 text-sm leading-relaxed">{review}</p>
              <button onClick={() => setReviews(p => p.filter((_, idx) => idx !== i))}
                className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                <FaTimes className="text-xs" />
              </button>
            </div>
          ))}
        </div>

        {/* Add review */}
        <div className="flex gap-2 mb-5">
          <input type="text" value={newReview} onChange={e => setNewReview(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addReview()}
            placeholder="Add a guest review..."
            className="input-field text-sm" />
          <button onClick={addReview}
            className="flex-shrink-0 w-11 h-11 bg-primary-900 hover:bg-primary-800 text-white rounded-xl flex items-center justify-center transition-all active:scale-95">
            <FaPlus className="text-sm" />
          </button>
        </div>

        <button onClick={handleSummarize} disabled={loading || !reviews.length}
          className="btn-secondary flex items-center gap-2 mb-5">
          {loading ? <FaSpinner className="animate-spin" /> : <FaRobot />}
          {loading ? 'Analyzing...' : 'Generate AI Summary'}
        </button>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-slate-100">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaThumbsUp className="text-green-600 text-sm" />
                </div>
                <h4 className="font-semibold text-green-800 text-sm">What Guests Love</h4>
              </div>
              <p className="text-green-700 text-sm leading-relaxed">{summary.positive}</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaThumbsDown className="text-red-600 text-sm" />
                </div>
                <h4 className="font-semibold text-red-800 text-sm">Areas to Improve</h4>
              </div>
              <p className="text-red-700 text-sm leading-relaxed">{summary.negative}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FaStar className="text-amber-600 text-sm" />
                </div>
                <h4 className="font-semibold text-amber-800 text-sm">Overall Verdict</h4>
              </div>
              <p className="text-amber-700 text-sm leading-relaxed">{summary.overall}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSummary;
