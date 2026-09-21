import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';
import { FaHotel, FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// ── Defined OUTSIDE Register so it is never re-created on re-render ──
// If defined inside, every keystroke re-renders Register → new Field reference
// → React unmounts/remounts the input → focus is lost after each character.
const Field = ({ icon: Icon, label, name, type, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
      <input
        type={type || 'text'}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="input-field pl-10"
      />
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      loginUser(data);
      showSuccess('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      showError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 relative">
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80"
          alt="Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/75" />
        <div className="relative flex flex-col p-12 text-white w-full">
          <div className="flex items-center gap-2.5 mb-auto">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-serif text-xl font-bold">Luxury<span className="text-gold">Stay</span></span>
          </div>
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold mb-4">Join thousands of happy guests</h2>
            <ul className="space-y-3 text-slate-300 text-sm">
              {['AI-powered room recommendations', 'Instant booking confirmation', 'Free cancellation policy', '24/7 concierge support'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-serif text-xl font-bold text-primary-900">Luxury<span className="text-gold">Stay</span></span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-2">Create your account</h2>
          <p className="text-slate-500 text-sm mb-8">Start your luxury experience today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={FaUser}     label="Full Name"      name="name"  placeholder="John Doe"          value={formData.name}  onChange={handleChange} />
            <Field icon={FaEnvelope} label="Email address"  name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
            <Field icon={FaPhone}    label="Phone number"   name="phone" type="tel"   placeholder="+91 98765 43210"  value={formData.phone} onChange={handleChange} />

            {/* Password — needs show/hide toggle so kept inline */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(o => !o)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat password"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-900 font-semibold hover:text-gold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
