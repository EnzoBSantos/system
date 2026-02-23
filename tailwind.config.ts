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
        serif: ["'Inter'", "sans-serif"], // Switching to clean sans for headings too
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        border: "#1c1c1e",
        input: "#1c1c1e",
        ring: "#ffffff",
        background: "#090909",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#1c1c1e",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ff453a",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1c1c1e",
          foreground: "#8e8e93",
        },
        accent: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#121212",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "1.5rem",
        md: "1rem",
        sm: "0.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;