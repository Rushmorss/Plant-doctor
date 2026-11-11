export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1F5E23',
          soft: '#E6F2E6',
        },
        secondary: '#81C784',
        canvas: '#F5F9F4',
        surface: '#FFFFFF',
        ink: '#26352A',
        muted: '#78909C',
        line: '#E2EBE1',
        warning: {
          DEFAULT: '#F9A825',
          soft: '#FEF5DD',
          ink: '#7A5200',
        },
        danger: {
          DEFAULT: '#E53935',
          soft: '#FDECEC',
          ink: '#B3261E',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(38,53,42,0.04), 0 4px 16px rgba(38,53,42,0.06)',
        lift: '0 12px 32px rgba(38,53,42,0.14)',
      },
    },
  },
  plugins: [],
};
