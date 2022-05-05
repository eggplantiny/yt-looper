module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    options: {
      safelist: [/^bg-/, /^text-/, /^border-/, /^hover:bg-/, /^hover:text-/]
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@vueform/slider/tailwind'),
    require("daisyui")
  ]
}
