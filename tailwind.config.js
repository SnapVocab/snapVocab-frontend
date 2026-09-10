const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f0fce4',
          100: '#def7c4',
          200: '#c2ee96',
          300: '#a0e063',
          400: '#7dd634',
          500: '#58cc02',
          600: '#4cad02',
          700: '#3c8c00',
          800: '#2f6e00',
          900: '#1f4a00',
        },
        neutral: {
          50: '#eeeff3',
          100: '#d4d5df',
          200: '#b6b7c7',
          300: '#9597ad',
          400: '#757793',
          500: '#565879',
          600: '#3d3f5e',
          700: '#2a2c47',
          800: '#171a2f',
          900: '#0d0e1a',
        },
        reward: {
          500: '#ffc42e',
          600: '#e5a800',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ffc42e',
          600: '#e5a800',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          50: '#f0fce4',
          100: '#def7c4',
          200: '#c2ee96',
          300: '#a0e063',
          400: '#7dd634',
          500: '#58cc02',
          600: '#4cad02',
          700: '#3c8c00',
          800: '#2f6e00',
          900: '#1f4a00',
        },
        mascot: {
          50: '#fff8ef',
          100: '#fff3e0',
          200: '#ffddb3',
          400: '#ffb65c',
          500: '#ff8a00',
          600: '#e57c00',
          800: '#a75c21',
          navy: '#1e2a44',
          blue: '#4da3ff',
          violet: '#8b6cff',
          cream: '#fff3e0',
        },
        info: {
          50: '#e8f7fe',
          100: '#c7ecfc',
          500: '#1cb0f6',
          600: '#0b8fce',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      spacing: {
        '13': '3.25rem', // 52px
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
