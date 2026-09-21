/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a',
          50:  '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light:   '#f0d080',
          dark:    '#a07830',
        },
        accent: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.16)',
        'nav': '0 2px 20px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'hero': "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.5) 100%)",
      }
    },
  },
  plugins: [],
}
