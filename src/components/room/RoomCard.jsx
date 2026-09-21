import { Link } from 'react-router-dom';
import { FaUsers, FaVectorSquare, FaStar } from 'react-icons/fa';

const CATEGORY_COLORS = {
  Single:        'bg-slate-100 text-slate-700',
  Double:        'bg-blue-100 text-blue-700',
  Deluxe:        'bg-purple-100 text-purple-700',
  Suite:         'bg-amber-100 text-amber-700',
  Presidential:  'bg-rose-100 text-rose-700',
};

const RoomCard = ({ room }) => {
  // Images from seed data are full URLs; uploaded images start with /uploads/
  const imageUrl = room.images?.length
    ? (room.images[0].startsWith('http') ? room.images[0] : `http://localhost:5000${room.images[0]}`)
    : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

  return (
    <div className="card group cursor-pointer">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
          <span className="text-primary-900 font-bold text-sm">₹{room.price?.toLocaleString('en-IN')}</span>
          <span className="text-slate-400 text-xs">/night</span>
        </div>

        {/* Availability */}
        {!room.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-primary-900 text-lg leading-tight">{room.name}</h3>
          <span className={`badge text-xs ml-2 flex-shrink-0 ${CATEGORY_COLORS[room.category] || 'bg-slate-100 text-slate-700'}`}>
            {room.category}
          </span>
        </div>

        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{room.description}</p>

        <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
          <span className="flex items-center gap-1.5">
            <FaUsers className="text-gold" />
            {room.capacity} guests
          </span>
          <span className="flex items-center gap-1.5">
            <FaVectorSquare className="text-gold" />
            {room.size ? `${room.size} sq ft` : 'On Request'}
          </span>
        </div>

        {/* Amenity chips */}
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-lg">
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="bg-slate-50 border border-slate-200 text-slate-400 text-xs px-2.5 py-1 rounded-lg">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <Link
          to={`/rooms/${room._id}`}
          className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            ${room.isAvailable
              ? 'bg-primary-900 text-white hover:bg-primary-800 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
            }`}
        >
          {room.isAvailable ? 'View Details' : 'Unavailable'}
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
