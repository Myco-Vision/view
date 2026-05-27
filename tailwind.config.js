/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary green (auth pages & user sidebar)
        primary: {
          DEFAULT: '#5a9e6f',
          light:   '#6ec27f',
          dark:    '#4a8c5f',
          50:      '#f0faf3',
          100:     '#d1fae5',
        },
        // Sidebar greens (user layout)
        sidebar: {
          bg:     '#f5fbf6',
          border: '#d6eedd',
          hover:  '#daf0e0',
          text:   '#1a2e1e',
          muted:  '#5c7a63',
        },
        // Content background (user layout)
        content: '#edf7ef',
      },
      fontFamily: {
        sans:   ['Inter', 'DM Sans', 'sans-serif'],
        serif:  ['Lora', 'serif'],
        dm:     ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
