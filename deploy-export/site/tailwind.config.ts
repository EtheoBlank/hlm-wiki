import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ink': '#3A4A5C',
        'vermilion': '#A93226',
        'rice-paper': '#F4ECD8',
        'mist': '#F0EFE9',
      },
      fontFamily: {
        'serif': ['Source Han Serif', 'Songti SC', 'Garamond', 'Crimson Text', 'serif'],
        'kai': ['Kaiti SC', '霞鹜文楷', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config