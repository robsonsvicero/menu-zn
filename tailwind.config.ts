import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    /* ========================================
       CORES — ds.md §1 (Color Tokens)
    ======================================== */
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      // bg-editorial-surface — Off-White (fundo primário, efeito marfim)
      background: '#FAF8F2',

      // text-editorial-on-surface — Charcoal / Dark Grey
      'on-surface': '#2f2e2e',

      // editorial-primary — Peach Terracotta Accent (cabeçalhos, botões, links ativos)
      primary: '#943515',

      // editorial-secondary — Peach Terracotta (botões outline, hover)
      secondary: '#D69869',

      // editorial-surface-low — Soft Obsidian (rodapé, blocos bento escuros)
      'surface-dark': '#222222',

      // editorial-surface-bright — Pure White (cards, modais elevados)
      surface: '#ffffff',

      // editorial-secondary (Silver Gray) — textos de apoio, tags, bordas em fundos escuros
      muted: '#b9b9b9',

      // editorial-outline — Bento Outline Slate (bordas finas, grades)
      outline: '#cbd5e1',

      // error — Gastro Crimson Alert
      error: '#ff4040',
    },

    /* ========================================
       CONTAINER — ds.md §4 (Layout Tokens)
    ======================================== */
    container: {
      center: true,
      screens: {
        '2xl': '1440px',
      },
      padding: {
        DEFAULT: '120px',
        lg: '96px',
        md: '64px',
        sm: '24px',
      },
    },

    extend: {
      /* ========================================
         TIPOGRAFIA — ds.md §2 (Typography Tokens)
      ======================================== */
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-caslon)', 'Georgia', 'serif'],
      },

      fontSize: {
        // Escala tipográfica do DS (nome: [tamanho, { lineHeight, fontWeight }])
        'title-xl':  ['60px', { lineHeight: '84px' }],
        'page-title': ['50px', { lineHeight: '70px' }],
        'heading-3': ['40px', { lineHeight: '56px' }],
        'heading-4': ['40px', { lineHeight: '56px' }],
        'heading-5': ['30px', { lineHeight: '42px' }],
        'heading-6': ['22px', { lineHeight: '30.8px' }],
        'body-l':    ['17px', { lineHeight: '23.8px' }],
        'body-m':    ['15px', { lineHeight: '21px' }],
        'body-s':    ['14px', { lineHeight: '19.6px' }],
        'body-xs':   ['12px', { lineHeight: '16.8px' }],
      },

      /* ========================================
         FORMAS E BORDAS — ds.md §3 (Shape Tokens)
      ======================================== */
      borderRadius: {
        sm: '6px',
        DEFAULT: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
