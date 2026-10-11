/** @type {import('tailwindcss').Config} */
// RURUbaazar design tokens. Sampled directly from the logo (RURUbaazar.png):
//   logo red    #FF3231  → logo orange #FF894A   (the "RURU" gradient)
//   logo purple #5E17EB                           (the "baazar" wordmark)
//
// ROLE OF EACH COLOUR (use semantic names in components, never raw hex):
//   brand  = vibrant red   → primary buttons, prices, badges, active states
//   accent = orange        → gradient end, highlights, decorative touches
//   royal  = deep purple   → headings accents, links, secondary buttons, dark hero/sections
//   ink / surface          → purple-tinted neutrals (replace default greys)
//
// ACCESSIBILITY: logo red (#FF3231) is only 3.5:1 on white, so text-bearing surfaces use
// brand-600 (#DE2323) or darker (≥4.5:1 with white). brand-500 / accent are for large or
// decorative use. Never put small white text on accent-400/500.
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF3F1',
          100: '#FFE3DF',
          200: '#FFC7C0',
          300: '#FFA196',
          400: '#FF6A5E',
          500: '#FF3231', // logo red
          600: '#DE2323', // buttons (white text 4.5:1+)
          700: '#B91C1F', // hover
          800: '#961A1E',
          900: '#7A181C',
          DEFAULT: '#DE2323',
        },
        accent: {
          50:  '#FFF6ED',
          100: '#FFEAD5',
          200: '#FFD2A8',
          300: '#FFB674',
          400: '#FF9E5E',
          500: '#FF894A', // logo orange
          600: '#F26A1F',
          700: '#C94F12',
          DEFAULT: '#FF894A',
        },
        royal: {
          50:  '#F6F1FF',
          100: '#EBE1FF',
          200: '#D8C6FF',
          300: '#BC9DFF',
          400: '#9A6BFB',
          500: '#7B3FF2',
          600: '#5E17EB', // logo purple
          700: '#4A10C4',
          800: '#3B0D9C',
          900: '#2A0A6B',
          950: '#1B0745',
          DEFAULT: '#5E17EB',
        },
        // Purple-tinted neutrals.
        surface: {
          DEFAULT: '#FFFFFF',
          muted:   '#F8F6FD', // page background
          border:  '#E7E1F3',
        },
        ink: {
          DEFAULT: '#1B0F3B', // primary text (17:1)
          soft:    '#5A5273', // secondary text (7:1)
          faint:   '#6F688C', // tertiary text (5:1)
        },
        success: '#15803D',
        danger:  '#C81E1E',
        warning: '#B45309',
      },
      fontFamily: {
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Playfair Display matches the serif letterforms in the logo.
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: { ui: '0.75rem' },
      boxShadow: {
        card:  '0 1px 2px rgba(27,15,59,.05), 0 8px 24px -14px rgba(27,15,59,.18)',
        lift:  '0 2px 4px rgba(27,15,59,.06), 0 18px 40px -16px rgba(94,23,235,.30)',
        brand: '0 8px 20px -10px rgba(222,35,35,.65)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #FF3231 0%, #FF894A 100%)',
        'hero-gradient':  'linear-gradient(135deg, #1B0745 0%, #3B0D9C 55%, #5E17EB 100%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: { 'fade-up': 'fade-up .5s ease-out both' },
    },
  },
  plugins: [],
};
