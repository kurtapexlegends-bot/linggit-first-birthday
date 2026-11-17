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
        rachel: {
          pink: {
            DEFAULT: "#F472B6",
            light: "#FCE7F3",
            dark: "#DB2777",
          },
          blue: {
            DEFAULT: "#38BDF8",
            light: "#E0F2FE",
            dark: "#0284C7",
            denim: "#2563EB",
          },
          yellow: {
            DEFAULT: "#FBBF24",
            light: "#FEF9C3",
            dark: "#D97706",
          },
          canvas: "#FFFDF7",
        },
        neutralPalette: {
          cream: "#F7F4EB",
          taupe: "#D8C7B8",
          tan: "#C4B598",
          sage: "#B5C7B2",
          mocha: "#8C7A6B",
        },
      },
      fontFamily: {
        bubble: ["var(--font-fredoka)", "sans-serif"],
        body: ["var(--font-quicksand)", "sans-serif"],
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "bounce-slow": "bounce 3s infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
