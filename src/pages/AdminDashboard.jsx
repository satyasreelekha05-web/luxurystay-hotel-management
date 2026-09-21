import { useState, useEffect } from 'react';
import { getAllBookings, getBookingStats, getRooms, getAllUsers, updateBookingStatus, deleteRoom, deleteUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { showSuccess, showError } from '../utils/toast';
import { FaRupeeSign, FaCalendarCheck, FaClock, FaBan, FaBed, FaUsers } from 'react-icons/fa';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const { data } = await getBookingStats();
        setStats(data);
      } else if (activeTab === 'bookings') {
        const { data } = await getAllBookings();
        setBookings(data.bookings);
      } else if (activeTab === 'rooms') {
        const { data } = await getRooms({ limit: 100 });
        setRooms(data.rooms);
      } else if (activeTab === 'users') {
        const { data } = await getAllUsers();
        setUsers(data);
      }
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, { status });
      showSuccess('Booking status updated');
      fetchData();
    } catch (error) {
      showError('Failed to update status');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(roomId);
      showSuccess('Room deleted successfully');
      fetchData();
    } catch (error) {
      showError('Failed to delete room');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      showSuccess('User deleted successfully');
      fetchData();
    } catch (error) {
      showError('Failed to delete user');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        {['stats', 'bookings', 'rooms', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition capitalize ${
              activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</p>
              </div>
              <FaRupeeSign className="text-5xl text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalBookings || 0}</p>
              </div>
              <FaCalendarCheck className="text-5xl text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmedBookings || 0}</p>
              </div>
              <FaCalendarCheck className="text-5xl text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings || 0}</p>
              </div>
              <FaClock className="text-5xl text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Booking ID</th>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Room</th>
                  <th className="px-6 py-4 text-left">Check-in</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td className="px-6 py-4">{booking._id.slice(-6)}</td>
                    <td className="px-6 py-4">{booking.user?.name}</td>
                    <td className="px-6 py-4">{booking.room?.name}</td>
                    <td className="px-6 py-4">{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">₹{booking.totalPrice?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div>
          <button
            onClick={() => navigate('/admin/add-room')}
            className="btn-primary mb-6"
          >
            Add New Room
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-2">{room.category}</p>
                <p className="text-2xl font-bold text-primary mb-4">₹{room.price?.toLocaleString('en-IN')}/night</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-room/${room._id}`)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
