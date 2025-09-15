import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    space: "#0D0D0D",
    mist: "#C0C0C0",
    primary: "#7B2CBF",
    accent: "#FFB700",
    neon: "#39FF14",
    cyan: "#00FFFF",
    crimson: "#DC143C",
    charcoal: "#36454F",
    silver: "#C0C0C0",
    white: "#FFFFFF"
  } } },
  plugins: [],
};
export default config;
