module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F6F5E',
          light: '#E9F3F0',
          dark: '#225245',
        },
        accent: {
          DEFAULT: '#E8A33D',
          light: '#FDF5E8',
        },
        success: {
          DEFAULT: '#3C9A5F',
          light: '#EBF7F0',
        },
        warning: {
          DEFAULT: '#D98C2B',
          light: '#FDF6EB',
        },
        critical: {
          DEFAULT: '#C24B4B',
          light: '#FDF2F2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#FAFAF7',
          border: '#E5E1D8',
        },
        neutralText: {
          DEFAULT: '#1F2937',
          muted: '#6B7280',
        },
        brand: {
          teal: '#2F6F5E',
          'teal-light': '#E9F3F0',
          terracotta: '#E8A33D',
          'neutral-900': '#1F2937',
          'neutral-600': '#6B7280',
          'neutral-100': '#FAFAF7',
          'neutral-000': '#FFFFFF',
        },
        severity: {
          info: '#2F6F5E',
          caution: '#D98C2B',
          serious: '#C24B4B',
          done: '#3C9A5F',
          missed: '#C24B4B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

