/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("daisyui")],
  content: [
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./layouts/**/*.{vue,js,ts,jsx,tsx}",
    "./pages/**/*.{vue,js,ts,jsx,tsx}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./assets/**/*.{scss,css}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        tomato: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#dc2626",        // Red-600 (Tomato)
          "primary-content": "#ffffff",
          "secondary": "#ef4444",      // Red-500
          "secondary-content": "#ffffff",
          "accent": "#f87171",         // Red-400
          "accent-content": "#1f2937",
          "neutral": "#1f2937",        // Gray-800
          "neutral-content": "#f3f4f6",
          "base-100": "#ffffff",       // White - Main background
          "base-200": "#f9fafb",       // Gray-50 - Card backgrounds
          "base-300": "#e5e7eb",       // Gray-200 - Borders
          "base-content": "#1f2937",   // Gray-800 - Text
          "info": "#3b82f6",           // Blue-500
          "info-content": "#ffffff",
          "success": "#10b981",        // Emerald-500
          "success-content": "#ffffff",
          "warning": "#f59e0b",        // Amber-500
          "warning-content": "#ffffff",
          "error": "#ef4444",          // Red-500
          "error-content": "#ffffff",
          "--contrast-color": "#ffffff",
        },
      },
      {
        dark: {
          "primary": "#dc2626",        // Red-600 (Tomato)
          "primary-content": "#ffffff",
          "secondary": "#ef4444",      // Red-500
          "secondary-content": "#ffffff",
          "accent": "#f87171",         // Red-400
          "accent-content": "#1f2937",
          "neutral": "#1f2937",        // Gray-800
          "neutral-content": "#f3f4f6",
          "base-100": "#111827",       // Gray-900 - Main background
          "base-200": "#1f2937",       // Gray-800 - Card backgrounds
          "base-300": "#374151",       // Gray-700 - Borders
          "base-content": "#f9fafb",   // Gray-50 - Text
          "info": "#3b82f6",           // Blue-500
          "info-content": "#ffffff",
          "success": "#10b981",        // Emerald-500
          "success-content": "#ffffff",
          "warning": "#f59e0b",        // Amber-500
          "warning-content": "#ffffff",
          "error": "#ef4444",          // Red-500
          "error-content": "#ffffff",
          "--contrast-color": "#111827",
        },
      },
    ],
  },
};
