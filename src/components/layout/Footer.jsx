import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHotel, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-primary-900 text-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-serif text-xl font-bold">
              Luxury<span className="text-gold">Stay</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Experience world-class hospitality with premium rooms, exceptional service, and unforgettable memories.
          </p>
          <div className="flex gap-3">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors duration-200">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-slate-400 mb-5">Explore</h4>
          <ul className="space-y-3">
            {[['/', 'Home'], ['/rooms', 'Our Rooms'], ['/dashboard', 'My Bookings']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-slate-300 hover:text-gold text-sm transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Room Types */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-slate-400 mb-5">Room Types</h4>
          <ul className="space-y-3">
            {['Single Room', 'Double Room', 'Deluxe Room', 'Suite', 'Presidential Suite'].map(r => (
              <li key={r}>
                <Link to="/rooms" className="text-slate-300 hover:text-gold text-sm transition-colors duration-200">
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-sm uppercase tracking-widest text-slate-400 mb-5">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300 text-sm">
              <FaMapMarkerAlt className="text-gold mt-0.5 flex-shrink-0" />
              <span>123 Luxury Avenue, Downtown, City 10001</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <FaPhone className="text-gold flex-shrink-0" />
              <span>+1 (234) 567-8900</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <FaEnvelope className="text-gold flex-shrink-0" />
              <span>info@luxurystay.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">© 2024 LuxuryStay Hotel. All rights reserved.</p>
        <p className="text-slate-500 text-sm">AI-Powered Hotel Management System</p>
      </div>
    </div>
  </footer>
);

export default Footer;
