import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
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
        display: ['"Syne"', '"Space Grotesk"', "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(.16,1,.3,1)",
      },
      colors: {
        lime: { DEFAULT: "#D4FF24" },
        cobalt: { DEFAULT: "#1558C9", light: "#4D8AF0" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        /* Electric Cobalt Blue — #1558C9 core (replaces cyan scale) */
        cyan: {
          DEFAULT: "#1558C9",
          light: "#518AEF",
          dark: "#0F3E92",
          50: "#EAF1FF",
          100: "#D2E3FF",
          200: "#A6C6FF",
          300: "#79A7FC",
          400: "#518AEF",
          500: "#1558C9",
          600: "#124CB2",
          700: "#0F3E92",
          800: "#0C3276",
          900: "#092455",
          950: "#051733",
        },
        /* Acid Lime — #D4FF24 core (replaces pink scale) */
        pink: {
          DEFAULT: "#D4FF24",
          light: "#E3FF66",
          dark: "#B8E11C",
          50: "#FAFFEB",
          100: "#F2FECF",
          200: "#E6FCA4",
          300: "#E3FF66",
          400: "#DDFF4D",
          500: "#D4FF24",
          600: "#B8E11C",
          700: "#97B815",
          800: "#749110",
          900: "#55690C",
          950: "#2E3A07",
        },
        /* Slate Blue — replaces purple scale */
        purple: {
          DEFAULT: "#4668B0",
          light: "#6C8CD9",
          dark: "#37538E",
          400: "#6C8CD9",
          500: "#4668B0",
          600: "#37538E",
        },
        /* Deep Lime — replaces yellow scale */
        yellow: {
          DEFAULT: "#B2D520",
          light: "#C9E939",
          dark: "#8FAE1A",
          400: "#C9E939",
          500: "#B2D520",
          600: "#8FAE1A",
        },
        /* Acid Lime — replaces green scale (status/positive) */
        green: {
          DEFAULT: "#D4FF24",
          light: "#DDFF4D",
          dark: "#B8E11C",
          400: "#DDFF4D",
          500: "#D4FF24",
          600: "#B8E11C",
        },
        /* Bright Cobalt — replaces blue scale */
        blue: {
          DEFAULT: "#1E63D8",
          light: "#5C92F7",
          dark: "#0F47AB",
          50: "#EDF3FF",
          100: "#D9E5FF",
          200: "#B0CBFF",
          300: "#82ADFF",
          400: "#5C92F7",
          500: "#1E63D8",
          600: "#1558C9",
          700: "#0F47AB",
          800: "#0C3886",
          900: "#0A2C66",
          950: "#051A3B",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 1px rgba(21, 88, 201, 0.3)" },
          "50%": { boxShadow: "0 0 0 1px rgba(21, 88, 201, 0.6), 0 4px 24px rgba(21, 88, 201, 0.25)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bg-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.6" },
          "100%": { transform: "scale(6)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "bg-shift": "bg-shift 12s ease infinite",
        ripple: "ripple 0.6s ease-out forwards",
      },
      backgroundImage: {
        "cyan-gradient":
          "linear-gradient(270deg, #1558C9, #1E63D8, #1558C9, #1E63D8)",
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
