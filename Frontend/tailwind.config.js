export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        neon: {
          cyan: '#00D9FF',
          blue: '#0099FF',
          purple: '#B300FF',
          pink: '#FF006E',
          green: '#39FF14',
        },
        dark: {
          bg: '#050505',
          card: '#0a0a0a',
          border: '#1a1a1a',
          secondary: '#0f0f0f',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 217, 255, 0.6), 0 0 40px rgba(0, 217, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(179, 0, 255, 0.6), 0 0 40px rgba(179, 0, 255, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.6), 0 0 40px rgba(255, 0, 110, 0.3)',
        'glow': '0 0 30px rgba(0, 217, 255, 0.4)',
        'glow-purple': '0 0 30px rgba(179, 0, 255, 0.4)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 217, 255, 0.6), 0 0 40px rgba(0, 217, 255, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 10px rgba(0, 217, 255, 0.3), 0 0 20px rgba(0, 217, 255, 0.1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-expand': {
          '0%': { boxShadow: '0 0 5px rgba(0, 217, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.8), 0 0 40px rgba(0, 217, 255, 0.4)' },
        },
        'cyber-scan': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-expand': 'glow-expand 0.3s ease-out forwards',
        'cyber-scan': 'cyber-scan 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}