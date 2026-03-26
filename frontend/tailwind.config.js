/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色系 - 日落色谱（琥珀→桃红→紫罗兰）
        primary: {
          50: '#FFF8F0',
          100: '#FFEFD9',
          200: '#FFE0B3',
          300: '#FFCF8C',
          400: '#FFB866',
          500: '#E67E22',  // 主色：深琥珀
          600: '#D35400',
          700: '#BA4A00',
          800: '#A04000',
          900: '#873600',
        },
        // 辅助色 - 日落渐变
        sunset: {
          amber: '#F39C12',
          peach: '#E74C3C',
          coral: '#EC7063',
          rose: '#D98880',
          lavender: '#BB8FCE',
        },
        // 中性色系 - 纸质和墨水
        neutral: {
          bg: '#FFF8F0',        // 纸白
          card: '#FFFBF7',      // 卡片白
          text: '#2D2D2D',      // 墨黑
          secondary: '#5D5D5D', // 灰墨
          border: '#E8DDD0',    // 纸边
          ink: '#1A1A1A',       // 深墨
        },
        // 功能色 - 柔和版本
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
      },
      fontFamily: {
        display: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.7' }],
        'lg': ['1.125rem', { lineHeight: '1.7' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'sm': '0.5rem',
        'DEFAULT': '0.75rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '2.5rem',
        'full': '9999px',
      },
      boxShadow: {
        // 柔和的纸质阴影
        'paper-sm': '0 2px 8px rgba(230, 126, 34, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'paper': '0 4px 16px rgba(230, 126, 34, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
        'paper-lg': '0 8px 24px rgba(230, 126, 34, 0.16), 0 4px 12px rgba(0, 0, 0, 0.1)',
        'paper-xl': '0 12px 32px rgba(230, 126, 34, 0.2), 0 6px 16px rgba(0, 0, 0, 0.12)',
        // 内阴影 - 凹陷效果
        'inset': 'inset 0 2px 8px rgba(0, 0, 0, 0.08)',
        // 发光效果
        'glow': '0 0 20px rgba(230, 126, 34, 0.3)',
        'glow-lg': '0 0 40px rgba(230, 126, 34, 0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        // 优雅的动画
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ink-spread': 'inkSpread 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        inkSpread: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
            filter: 'blur(10px)',
          },
          '50%': {
            opacity: '0.5',
            filter: 'blur(5px)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
            filter: 'blur(0)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

