import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';
import { FaHotel, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(formData);
      loginUser(data);
      showSuccess('Welcome back!');
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      showError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80"
          alt="Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/70" />
        <div className="relative flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-2.5 mb-auto pt-8">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-serif text-xl font-bold">Luxury<span className="text-gold">Stay</span></span>
          </div>
          <blockquote className="mb-8">
            <p className="font-serif text-2xl font-semibold leading-relaxed mb-4">
              "Every stay is a story worth telling."
            </p>
            <p className="text-slate-300 text-sm">— LuxuryStay Hotel</p>
          </blockquote>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-serif text-xl font-bold text-primary-900">Luxury<span className="text-gold">Stay</span></span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to manage your bookings</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input type={showPass ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} required placeholder="••••••••" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(o => !o)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-900 font-semibold hover:text-gold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
