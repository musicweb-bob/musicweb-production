/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom font families
      fontFamily: {
        display: ['Epilogue', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // Enhanced typography scale
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-xl': ['1.25rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-xs': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.04em', fontWeight: '600' }],
      },

      // Expanded color palette
      colors: {
        // Core brand (existing)
        brand: {
          orange: '#FF6B35',
          'orange-dark': '#ff5722',
        },
        // Secondary purple accent
        accent: {
          purple: '#A855F7',
          'purple-dark': '#9333EA',
          'purple-light': '#C084FC',
        },
        // Tertiary electric blue
        electric: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        // Enhanced backgrounds
        surface: {
          'base': '#1a1d2e',
          'elevated': '#151825',
          'overlay': '#0d0f1a',
          'card': '#1f2237',
          'card-hover': '#252945',
        },
        // Glassmorphism colors
        glass: {
          'white-10': 'rgba(255, 255, 255, 0.1)',
          'white-15': 'rgba(255, 255, 255, 0.15)',
          'white-20': 'rgba(255, 255, 255, 0.2)',
          'dark-40': 'rgba(0, 0, 0, 0.4)',
          'dark-60': 'rgba(0, 0, 0, 0.6)',
        },
        // Semantic colors
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },

      // Gradient backgrounds
      backgroundImage: {
        'gradient-sunset': 'linear-gradient(135deg, #FF6B35 0%, #A855F7 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
        'gradient-fire': 'linear-gradient(135deg, #FF6B35 0%, #ff5722 50%, #DC2626 100%)',
        'gradient-purple': 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, #FF6B35 0px, transparent 50%), radial-gradient(at 80% 0%, #A855F7 0px, transparent 50%), radial-gradient(at 0% 50%, #3B82F6 0px, transparent 50%)',
      },

      // Enhanced spacing for sections
      spacing: {
        'section-sm': '5rem',   // 80px
        'section-md': '7rem',   // 112px
        'section-lg': '9rem',   // 144px
        'section-xl': '12rem',  // 192px
      },

      // Advanced shadow system
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3), 0 0 40px rgba(255, 107, 53, 0.15)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.15)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 107, 53, 0.2)',
        'glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },

      // Backdrop blur utilities
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },

      // Simple animations (no complex ones per user request)
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-slow-reverse': 'spin 20s linear infinite reverse',
        shimmer: 'shimmer 3s infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
