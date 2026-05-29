import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#EAF7F5",
          secondary: "#F5FBF9",
          tertiary: "#A8D9D0",
          accent: "#0E3A47",
        },
        ink: {
          primary: "#0E3A47",
          secondary: "#1d4d5b",
          muted: "#4f7782",
          inverse: "#EAF7F5",
        },
        brand: {
          DEFAULT: "#2E7F8C",
          muted: "#A8D9D0",
          deep: "#0E3A47",
          glow: "#3FA8B8",
        },
        line: {
          DEFAULT: "rgba(14,58,71,0.10)",
          strong: "rgba(14,58,71,0.20)",
          inverse: "rgba(234,247,245,0.15)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-monospace", "Menlo", "monospace"],
        mono: ["var(--font-body)", "ui-monospace", "Menlo", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "drift": "drift 12s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", filter: "blur(20px)" },
          "50%": { opacity: "0.9", filter: "blur(30px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(10px, -8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
