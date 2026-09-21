import { format } from 'date-fns';
import { FaCalendar, FaUsers, FaRupeeSign } from 'react-icons/fa';

const STATUS_STYLES = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending:   'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
};

const PAYMENT_STYLES = {
  paid:    'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  refunded:'bg-slate-100 text-slate-600',
};

const BookingCard = ({ booking, onCancel }) => {
  const imageUrl = booking.room?.images?.[0]
    ? (booking.room.images[0].startsWith('http') ? booking.room.images[0] : `http://localhost:5000${booking.room.images[0]}`)
    : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80';

  const nights = Math.ceil(
    (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 h-40 md:h-auto flex-shrink-0 overflow-hidden">
          <img src={imageUrl} alt={booking.room?.name} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-primary-900 text-lg">{booking.room?.name}</h3>
              <p className="text-slate-400 text-sm">{booking.room?.category}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`badge border text-xs ${STATUS_STYLES[booking.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <span className={`badge text-xs ${PAYMENT_STYLES[booking.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="flex items-center gap-2 text-slate-600">
              <FaCalendar className="text-gold text-xs flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Check-in</p>
                <p className="text-sm font-medium">{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FaCalendar className="text-gold text-xs flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Check-out</p>
                <p className="text-sm font-medium">{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FaUsers className="text-gold text-xs flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Guests</p>
                <p className="text-sm font-medium">{booking.numberOfGuests}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FaRupeeSign className="text-gold text-xs flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">{nights} night{nights !== 1 ? 's' : ''}</p>
                <p className="text-sm font-bold text-primary-900">₹{booking.totalPrice?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              onClick={() => onCancel(booking._id)}
              className="text-sm font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-all duration-200"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
