/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0A0A0E',
        void: '#050507',
        stage: '#141418',
        app: '#101014',
        sidebar: '#16161B',
        hairline: '#222228',
        crisp: '#F4F4F6',
        muted: '#8A8A93',
        orange: '#FF5500',
        cobalt: '#3B82F6',
        lime: '#A3E635',
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Syne"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
