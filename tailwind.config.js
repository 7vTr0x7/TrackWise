/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Next.js app dir
    "./pages/**/*.{js,ts,jsx,tsx}", // Next.js pages dir (if any)
    "./components/**/*.{js,ts,jsx,tsx}", // shadcn/ui components
    "./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}", // optional if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
