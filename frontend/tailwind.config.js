/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: "#c8a96e", dark: "#b8945a", light: "#d4b98a" },
        ink: { 1: "#0a0a0f", 2: "#13131a", 3: "#1e1e2e", 4: "#2a2a3a" },
        mist: { 1: "#e8e6e1", 2: "#9a9890", 3: "#4a4a6a" },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { opacity: 0, transform: "translateX(-16px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(200,169,110,0.4)" }, "50%": { boxShadow: "0 0 0 12px rgba(200,169,110,0)" } },
      },
    },
  },
  plugins: [],
}
