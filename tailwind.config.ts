import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jabBlue:   "#010e63", // brand primary
        jabBlue2:  "#004085",
        jabPurple: "#630183",
        jabNeon:   "#7fff41",
        jabPink:   "#ff00ff",
      },
      boxShadow: {
        neon: "0 0 0 3px rgba(127,255,65,.35)",
      },
    },
  },
  plugins: [],
};
export default config;
