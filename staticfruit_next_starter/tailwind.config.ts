import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { space: "#0d1117", mist: "#e6edf3", primary: "#61dafb", accent: "#bd83e8" } } },
  plugins: [],
};
export default config;
