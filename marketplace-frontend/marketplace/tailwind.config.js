export default {
  content: [
    "./**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#008ECC',
        secondary: '#00f6ff',
        background3: '#F3F9FB',
        background1: '#F5F5F5',
        textColor: '#666666',
        lightWhite: 'rgb(255, 255, 255, 0.7)',
        lightBlue: 'rgb(9, 151, 124, 0.1)',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
}