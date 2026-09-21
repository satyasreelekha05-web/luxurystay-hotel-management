import { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/booking/BookingCard';
import Loader from '../components/common/Loader';
import { showSuccess, showError } from '../utils/toast';
import { FaUser, FaCalendarAlt, FaBed, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await getUserBookings();
      setBookings(data);
    } catch { showError('Failed to fetch bookings'); }
    finally { setLoading(false); }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      showSuccess('Booking cancelled');
      fetchBookings();
    } catch { showError('Failed to cancel booking'); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateProfile(profileData);
      updateUser(data);
      showSuccess('Profile updated');
    } catch { showError('Failed to update profile'); }
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: <FaCalendarAlt />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: <FaCheckCircle />, color: 'bg-green-50 text-green-600' },
    { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon: <FaTimesCircle />, color: 'bg-red-50 text-red-600' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-white">{user?.name}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {stats.map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-slate-400 text-xs">{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card w-fit mb-8">
          {[
            { tab: 'bookings', label: 'My Bookings', icon: <FaCalendarAlt /> },
            { tab: 'profile',  label: 'Profile',     icon: <FaUser /> }
          ].map(({ tab, label, icon }) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab ? 'bg-primary-900 text-white shadow-sm' : 'text-slate-600 hover:text-primary-900'}`}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-card">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBed className="text-slate-400 text-2xl" />
              </div>
              <p className="text-xl font-semibold text-slate-700 mb-2">No bookings yet</p>
              <p className="text-slate-400 text-sm mb-6">Start exploring our premium rooms</p>
              <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <BookingCard key={booking._id} booking={booking} onCancel={handleCancelBooking} />
              ))}
            </div>
          )
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-white rounded-2xl shadow-card p-8">
            <h2 className="font-semibold text-primary-900 text-xl mb-6">Update Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email Address', key: 'email', type: 'email' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input type={type} value={profileData[key]}
                    onChange={e => setProfileData({ ...profileData, [key]: e.target.value })}
                    className="input-field" />
                </div>
              ))}
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
