module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "wb-dark": "#0f0e0c",
        "wb-gold": "#c9a84c",
        "wb-cream": "#f5f0e8",
        "wb-dark-lighter": "#1a1815",
      },
      fontFamily: {
        cormorant: ["Cormorant Garamond", "serif"],
        "dm-sans": ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        grain:
          "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22a%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%223%22 result=%22noise%22 seed=%221%22/><feDisplacementMap in=%22SourceGraphic%22 in2=%22noise%22 scale=%225%22 xChannelSelector=%22R%22 yChannelSelector=%22G%22/></filter><rect width=%22100%22 height=%22100%22 fill=%22%230f0e0c%22 filter=%22url(%23a)%22 opacity=%22.03%22/></svg>')",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        slideOut: "slideOut 0.3s ease-in",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
