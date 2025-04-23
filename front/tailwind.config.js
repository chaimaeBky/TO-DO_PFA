/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { //ajouter
        sans: [ 'Ronoto ' , 'sans-serif']
      } ,
      gridTemplateColumns: {
        '70/30': '70% 28%', //'70/30': This is a custom name you can use in your HTML to apply the grid layout. 
      //The first column will take up 70% of the container width, and the second column will take 28%.
      },
    },
  },
  plugins: [],
}

