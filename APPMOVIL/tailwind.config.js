/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0d121c",
        "brand-teal": "#064e3b",
        "brand-red": "#ff2e2e",
        "brand-light": "#f3f4f6"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      backdropBlur: {
        xs: "2px"
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out"
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
