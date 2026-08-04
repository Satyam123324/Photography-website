/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial Noir — near-black canvas, coral accent.
        // Semantic names kept stable so components restyle automatically.
        cream: { DEFAULT: "#0B0B0D", 100: "#0F0F12", 200: "#161619" }, // canvas + elevated bands
        surface: "#17171C",   // cards
        line: { DEFAULT: "#26262E", strong: "#34343E" },
        ink: { DEFAULT: "#F4F1EC", muted: "#9C98A2", faint: "#615E68" }, // warm-white text
        chalk: "#FFFFFF",     // crisp white for invert cards / emphasis
        clay: {               // the one vivid accent (coral)
          DEFAULT: "#FF5A47",
          dark: "#F03E28",
          light: "#FF8B7C",
          soft: "#2A1512",    // dark tint bg for chips/badges
          tint: "#120C0B",    // near-black wash with warmth
        },
        moss: { DEFAULT: "#54E08A", soft: "#12251B" },
        rose: { DEFAULT: "#FB7185", soft: "#2A1419" },
        amber: { DEFAULT: "#FBBF24", soft: "#2A2110" },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.35)",
        card: "0 2px 6px rgba(0,0,0,0.45), 0 12px 32px rgba(0,0,0,0.40)",
        lift: "0 10px 24px rgba(0,0,0,0.55), 0 28px 60px rgba(0,0,0,0.5)",
        clay: "0 8px 24px rgba(255,90,71,0.35)",
        flare: "0 0 0 1px rgba(255,90,71,0.4), 0 0 32px rgba(255,90,71,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.35s ease forwards",
        "scale-in": "scaleIn 0.2s ease forwards",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(18px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        scaleIn: { "0%": { opacity: 0, transform: "scale(0.96)" }, "100%": { opacity: 1, transform: "scale(1)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
    },
  },
  plugins: [],
}
