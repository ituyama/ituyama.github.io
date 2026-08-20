import type { Config } from "tailwindcss";

// Tailwind v4 resolves content automatically, but we keep an explicit
// config for clarity and to pin the scanned sources.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
};

export default config;
