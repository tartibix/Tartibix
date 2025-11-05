import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: '#171821',
        surface: '#21222D',
        accent: '#A9DFD8',
        'accent-soft': 'rgba(169, 223, 216, 0.4)',
        'muted-text': '#718096',
        'muted-placeholder': '#4A5568',
        'muted-foreground': '#CFD9E0',
        'soft-white': '#F7FAFC',
      },
      boxShadow: {
        inset: 'inset 0 0 10px rgba(169, 223, 216, 0.4)',
        card: '0 24px 60px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
