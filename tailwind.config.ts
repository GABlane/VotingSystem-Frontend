import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#111111',
        'surface-elevated': '#1a1a1a',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-strong': '#222222',
        primary: '#ffffff',
        secondary: '#888888',
        muted: '#999999',
        accent: '#0066FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '999px',
        input: '10px',
      },
      fontSize: {
        hero: 'clamp(48px, 7vw, 80px)',
      },
      letterSpacing: {
        tighter: '-0.03em',
        label: '0.1em',
      },
      backdropBlur: {
        nav: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
