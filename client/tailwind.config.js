/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-900": "#1E3A8A",
        "blue-600": "#2563EB",
        "orange-500": "#F97316",
        "gray-100": "#F3F4F6",
        "gray-900": "#1F2937",
      },
      fontFamily: {
        geist: ["var(--font-geist-sans)", "sans-serif"],
        "geist-mono": ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-blue-orange":
          "linear-gradient(135deg, #1E3A8A 0%, #F97316 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-up": "scaleUp 0.2s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Add for safety
};
