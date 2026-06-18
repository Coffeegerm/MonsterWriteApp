/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
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
        // MonsterWrite brand tokens — warm dark academia
        paper: '#F0E6D1',
        surface: '#FBF6EB',
        ink: '#14100A',
        'ink-surface': '#2A2117',
        brass: '#B0822F',
        oxblood: '#74302E',
        olive: '#5E6535',
        terracotta: '#B05C36',
        'study-teal': '#3F6B66',
        // Monster mood scale (flourishing -> fading)
        mood: {
          ecstatic: '#6E7A33',
          happy: '#C2902F',
          neutral: '#A87B4E',
          sad: '#6E8597',
          distressed: '#6B5560',
        },
      },
      fontFamily: {
        display: ['CormorantGaramond_600SemiBold'],
        serif: ['EBGaramond_400Regular'],
        mono: ['CourierPrime_400Regular'],
        sans: ['EBGaramond_400Regular'], // serif-forward brand; sans kept as a fallback
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        DEFAULT: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [],
};
