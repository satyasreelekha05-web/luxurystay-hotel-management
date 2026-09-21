import { useState } from 'react';
import { format } from 'date-fns';

const BookingForm = ({ room, onSubmit, onClose }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [formData, setFormData] = useState({
    checkInDate: today,
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // If checkin changes and checkout is now invalid, clear checkout
      if (name === 'checkInDate' && updated.checkOutDate && updated.checkOutDate <= value) {
        updated.checkOutDate = '';
      }
      return updated;
    });
  };

  // Checkout must be at least 1 day after checkin — prevents 0-night / ₹0 bookings
  const getMinCheckout = () => {
    if (formData.checkInDate) {
      const next = new Date(formData.checkInDate);
      next.setDate(next.getDate() + 1);
      return format(next, 'yyyy-MM-dd');
    }
    return today;
  };

  const calculateTotal = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const days = Math.ceil(
        (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24)
      );
      return days > 0 ? days * room.price : 0;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      numberOfGuests: parseInt(formData.numberOfGuests, 10)
    });
  };

  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
        <input
          type="date"
          name="checkInDate"
          value={formData.checkInDate}
          onChange={handleChange}
          min={today}
          required
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Check-out Date</label>
        <input
          type="date"
          name="checkOutDate"
          value={formData.checkOutDate}
          onChange={handleChange}
          min={getMinCheckout()}
          required
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Number of Guests</label>
        <input
          type="number"
          name="numberOfGuests"
          value={formData.numberOfGuests}
          onChange={handleChange}
          min="1"
          max={room.capacity}
          required
          className="input-field"
        />
        <p className="text-sm text-gray-500 mt-1">Maximum capacity: {room.capacity} guests</p>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">Special Requests (Optional)</label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          rows="3"
          className="input-field"
          placeholder="Any special requirements..."
        />
      </div>

      {total > 0 && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-slate-700 font-semibold">Total Price:</span>
            <span className="text-2xl font-bold text-primary-900">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24))} night(s) × ₹{room.price?.toLocaleString('en-IN')}
          </p>
        </div>
      )}

      <div className="flex space-x-4">
        <button type="submit" className="btn-primary flex-1">
          Proceed to Payment
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
