const config = {
  // 1. ADD THIS 'content' ARRAY
  // This tells Tailwind where to look for class names.
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // 2. ADD THE ENTIRE 'theme' OBJECT HERE
  theme: {
    // 'extend' is where you add your custom styles
    extend: {
      // 'keyframes' defines the animation's stages
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-20px, 30px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -20px)' },
        },
      },
      // 'animation' creates the utility class (e.g., 'animate-float')
      animation: {
        float: 'float 15s ease-in-out infinite',
        float2: 'float2 18s ease-in-out infinite',
      },
    },
  },

  // Your existing plugins array
  plugins: ["@tailwindcss/postcss"],
};

export default config;