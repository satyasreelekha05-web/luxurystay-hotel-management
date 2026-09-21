import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/booking/BookingForm';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import ReviewSummary from '../components/ai/ReviewSummary';
import { showSuccess, showError } from '../utils/toast';
import { FaUsers, FaVectorSquare, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const CATEGORY_COLORS = {
  Single: 'bg-slate-100 text-slate-700',
  Double: 'bg-blue-100 text-blue-700',
  Deluxe: 'bg-purple-100 text-purple-700',
  Suite: 'bg-amber-100 text-amber-700',
  Presidential: 'bg-rose-100 text-rose-700',
};

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { fetchRoom(); }, [id]);

  const fetchRoom = async () => {
    try {
      const { data } = await getRoomById(id);
      setRoom(data);
    } catch {
      showError('Failed to fetch room details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (bookingData) => {
    if (!isAuthenticated) {
      showError('Please login to book a room');
      navigate('/login');
      return;
    }
    try {
      const { data } = await createBooking({
        roomId: id,
        ...bookingData,
        numberOfGuests: parseInt(bookingData.numberOfGuests, 10)
      });
      showSuccess('Booking created successfully!');
      setShowBookingModal(false);
      navigate('/checkout', { state: { booking: data } });
    } catch (error) {
      showError(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <Loader />;
  if (!room) return <div className="text-center py-20 text-slate-500">Room not found</div>;

  const images = room.images?.length
    ? room.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
    : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/rooms')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-900 transition-colors">
            <FaArrowLeft className="text-xs" /> Back to Rooms
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-primary-900 font-medium">{room.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="relative h-80 md:h-[420px]">
                <img src={images[activeImg]} alt={room.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className={`badge text-xs ${CATEGORY_COLORS[room.category] || 'bg-slate-100 text-slate-700'}`}>
                    {room.category}
                  </span>
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all
                        ${activeImg === i ? 'border-primary-900' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-2xl shadow-card p-7">
              <div className="flex items-start justify-between mb-4">
                <h1 className="font-serif text-3xl font-bold text-primary-900">{room.name}</h1>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold">₹{room.price?.toLocaleString('en-IN')}</p>
                  <p className="text-slate-400 text-xs">per night</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-2"><FaUsers className="text-gold" /> {room.capacity} guests</span>
                <span className="flex items-center gap-2"><FaVectorSquare className="text-gold" /> {room.size ? `${room.size} sq ft` : 'On Request'}</span>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8">{room.description}</p>

              {room.amenities?.length > 0 && (
                <>
                  <h3 className="font-semibold text-primary-900 text-lg mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
                        <FaCheckCircle className="text-gold flex-shrink-0 text-sm" />
                        <span className="text-slate-700 text-sm">{a}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* AI Review Summary */}
            <ReviewSummary />
          </div>

          {/* Right: Sticky Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <div className="text-center pb-5 border-b border-slate-100 mb-5">
                <p className="text-3xl font-bold text-primary-900">₹{room.price?.toLocaleString('en-IN')}</p>
                <p className="text-slate-400 text-sm">per night</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                {[
                  ['Check-in', '2:00 PM'],
                  ['Check-out', '11:00 AM'],
                  ['Max Guests', `${room.capacity} persons`],
                  ['Room Size', room.size ? `${room.size} sq ft` : 'On Request'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-primary-900">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                disabled={!room.isAvailable}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200
                  ${room.isAvailable
                    ? 'bg-primary-900 text-white hover:bg-primary-800 active:scale-95 shadow-sm'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
              >
                {room.isAvailable ? 'Reserve Now' : 'Not Available'}
              </button>

              <p className="text-center text-slate-400 text-xs mt-3">Free cancellation · 24hrs before check-in</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Book Your Stay">
        <BookingForm room={room} onSubmit={handleBooking} onClose={() => setShowBookingModal(false)} />
      </Modal>
    </div>
  );
};

export default RoomDetail;
