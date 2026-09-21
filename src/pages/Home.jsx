import { Link } from 'react-router-dom';
import { FaSearch, FaBed, FaConciergeBell, FaWifi, FaStar, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { MdPool, MdSpa, MdRestaurant } from 'react-icons/md';

const STATS = [
  { value: '500+', label: 'Happy Guests' },
  { value: '50+',  label: 'Premium Rooms' },
  { value: '4.9',  label: 'Average Rating' },
  { value: '24/7', label: 'Concierge' },
];

const FEATURES = [
  {
    icon: <FaBed className="text-2xl" />,
    title: 'Luxury Rooms',
    desc: 'Spacious, elegantly designed rooms with premium bedding and modern amenities.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <FaConciergeBell className="text-2xl" />,
    title: '24/7 Concierge',
    desc: 'Round-the-clock personalized service to make every moment of your stay perfect.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: <FaWifi className="text-2xl" />,
    title: 'Smart Amenities',
    desc: 'High-speed WiFi, smart TVs, climate control, and all modern conveniences.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: <MdSpa className="text-2xl" />,
    title: 'Spa & Wellness',
    desc: 'Rejuvenate at our world-class spa with a full range of wellness treatments.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <MdRestaurant className="text-2xl" />,
    title: 'Fine Dining',
    desc: 'Savor exquisite cuisine crafted by award-winning chefs at our restaurant.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: <MdPool className="text-2xl" />,
    title: 'Infinity Pool',
    desc: 'Unwind in our stunning rooftop infinity pool with panoramic city views.',
    color: 'bg-cyan-50 text-cyan-600',
  },
];

const Home = () => (
  <div className="overflow-x-hidden">

    {/* ── Hero ── */}
    <section className="relative h-[92vh] min-h-[600px] flex items-center">
      <img
        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
        alt="LuxuryStay Hotel"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <FaStar className="text-gold" /> AI-Powered Hotel Experience
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Where Luxury<br />
            <span className="text-gold">Meets Comfort</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
            Discover premium rooms, world-class amenities, and an AI-powered booking experience crafted just for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/rooms" className="btn-secondary text-base px-8 py-4">
              <FaSearch /> Explore Rooms
            </Link>
            <Link to="/register" className="btn-outline border-white text-white hover:bg-white hover:text-primary-900 text-base px-8 py-4">
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-t-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
            {STATS.map(({ value, label }) => (
              <div key={label} className="px-6 py-5 text-center">
                <p className="font-serif text-2xl font-bold text-white">{value}</p>
                <p className="text-slate-300 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── Features ── */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</p>
        <h2 className="section-title">Everything You Need for a Perfect Stay</h2>
        <p className="section-sub max-w-xl mx-auto">
          From AI-powered room recommendations to world-class facilities — we've thought of everything.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ icon, title, desc, color }) => (
          <div key={title} className="group bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
              {icon}
            </div>
            <h3 className="font-semibold text-primary-900 text-lg mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="relative overflow-hidden bg-primary-900 py-24">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Limited Availability</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
          Ready for an Unforgettable Stay?
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          Join thousands of satisfied guests. Let our AI find the perfect room for you in seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/rooms" className="btn-secondary text-base px-8 py-4">
            Browse Rooms
          </Link>
          <Link to="/register" className="btn-outline border-white text-white hover:bg-white hover:text-primary-900 text-base px-8 py-4">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
