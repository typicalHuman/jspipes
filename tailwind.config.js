module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        scaleIn: "scaleIn 0.3s ease-out forwards",
        scaleOut: "scaleOut 0.3s ease-in forwards",
      },
      keyframes: {
        scaleIn: {
          "0%": {
            transform: "scale(0)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        scaleOut: {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(0)",
            opacity: "0",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
