import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["'DM Serif Display'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Lato'", "sans-serif"],
      },
      colors: {
        border: "#2a2721",
        input: "#2a2721",
        ring: "#f0a500",
        background: "#1a1814",
        foreground: "#c9b99a",
        primary: {
          DEFAULT: "#f0a500",
          foreground: "#1a1814",
        },
        secondary: {
          DEFAULT: "#2a2721",
          foreground: "#c9b99a",
        },
        destructive: {
          DEFAULT: "#8b2e2e",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#23211c",
          foreground: "#8a7e6a",
        },
        accent: {
          DEFAULT: "#f0a500",
          foreground: "#1a1814",
        },
        card: {
          DEFAULT: "#1e1c17",
          foreground: "#c9b99a",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;