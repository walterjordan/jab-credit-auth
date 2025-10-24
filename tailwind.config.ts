import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jabNeon: "#7FFF41",
        jabPurple: "#630183",
        jabBlue: "#010E63",
        jabMagenta: "#FF00FF",
        jabNavy: "#004085",
        jabWhite: "#FFFFFF",
        jabBlack: "#000000",
      },
    },
  },
  plugins: [],
};
export default config;

