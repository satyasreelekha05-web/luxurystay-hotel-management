import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccess } from '../../utils/toast';
import { FaHotel, FaUser, FaSignOutAlt, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    showSuccess('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`relative text-sm font-medium transition-colors duration-200 pb-0.5
        ${isActive(to)
          ? 'text-primary-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gold after:rounded-full'
          : 'text-slate-600 hover:text-primary-900'
        }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-nav sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-serif text-xl font-bold text-primary-900 tracking-tight">
              Luxury<span className="text-gold">Stay</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLink('/', 'Home')}
            {navLink('/rooms', 'Rooms')}
            {isAuthenticated && navLink(isAdmin ? '/admin/dashboard' : '/dashboard', 'Dashboard')}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <div className="w-7 h-7 bg-primary-900 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-xs" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user?.name?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-xs">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          {[['/', 'Home'], ['/rooms', 'Rooms']].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-primary-900 py-2 border-b border-slate-50">
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-primary-900 py-2 border-b border-slate-50">
              Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="w-full text-left text-sm font-medium text-red-500 py-2">
              Logout
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 py-2 text-xs">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 py-2 text-xs">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
