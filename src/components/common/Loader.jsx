import { FaHotel } from 'react-icons/fa';

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl bg-primary-900 flex items-center justify-center">
        <FaHotel className="text-white text-xl" />
      </div>
      <div className="absolute inset-0 rounded-2xl border-2 border-gold animate-ping opacity-30" />
    </div>
    <p className="text-slate-400 text-sm font-medium animate-pulse">Loading...</p>
  </div>
);

export default Loader;
