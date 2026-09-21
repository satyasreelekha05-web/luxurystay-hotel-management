import { useState, useEffect } from 'react';
import { getRooms } from '../services/api';
import RoomCard from '../components/room/RoomCard';
import RoomFilter from '../components/room/RoomFilter';
import Loader from '../components/common/Loader';
import { showError } from '../utils/toast';
import RoomRecommendation from '../components/ai/RoomRecommendation';
import { FaBed } from 'react-icons/fa';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [activeFilters, setActiveFilters] = useState({});

  const fetchRooms = async (filters = {}, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getRooms({ ...filters, page, limit: 9 });
      setRooms(data.rooms);
      setPagination({ currentPage: data.currentPage, totalPages: data.totalPages, total: data.total });
    } catch {
      showError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleFilter = (filters) => {
    setActiveFilters(filters);
    fetchRooms(filters, 1);
  };

  const handlePageChange = (page) => {
    fetchRooms(activeFilters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Page hero */}
      <div className="bg-primary-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
              <FaBed className="text-gold text-sm" />
            </div>
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">Our Collection</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">Find Your Perfect Room</h1>
          <p className="text-slate-400 text-lg">Browse our curated selection of premium rooms and suites</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <RoomRecommendation />
        <RoomFilter onFilter={handleFilter} />

        {loading ? (
          <Loader />
        ) : rooms.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-card">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBed className="text-slate-400 text-2xl" />
            </div>
            <p className="text-xl font-semibold text-slate-700 mb-2">No rooms found</p>
            <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-sm mb-6">
              Showing <span className="font-semibold text-primary-900">{rooms.length}</span> of{' '}
              <span className="font-semibold text-primary-900">{pagination.total}</span> rooms
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => <RoomCard key={room._id} room={room} />)}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600
                             hover:border-primary-900 hover:text-primary-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all
                      ${pagination.currentPage === i + 1
                        ? 'bg-primary-900 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-600 hover:border-primary-900 hover:text-primary-900'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600
                             hover:border-primary-900 hover:text-primary-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Rooms;
