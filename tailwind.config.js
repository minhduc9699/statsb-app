/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#17245e",
        secondary: "#fbbf24",
        orange: "#E86922",
        dark: "#0C0C16",
        tgray: "#868e96",
        green: "#2CAE32",
        bordergray: "#E9ECEF",
        studiobg: "#151524",
      },
      fontFamily: {
        epilogue: ['"Epilogue"', "serif"],
        roboto: ['"Roboto"', "serif"],
      },
    },
  },
  plugins: [],
};
