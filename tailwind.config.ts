import type { Config } from "tailwindcss";

const config = {
darkMode: ["class"],
content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
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
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
        light: "hsl(240, 80%, 70%)", // Soft Lavender
        dark: "hsl(240, 80%, 80%)", // Lighter Lavender for dark mode
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
        light: "hsl(200, 80%, 70%)", // Soft Light Blue
        dark: "hsl(200, 80%, 80%)", // Lighter Light Blue for dark mode
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      // Custom colors for gradients and text
      'bg-gradient-start-light': 'hsl(240, 100%, 98%)', // Very light lavender
      'bg-gradient-end-light': 'hsl(200, 100%, 98%)',   // Very light blue
      'bg-gradient-start-dark': 'hsl(240, 20%, 15%)',   // Darker lavender
      'bg-gradient-end-dark': 'hsl(200, 20%, 15%)',     // Darker blue
      'text-light': 'hsl(240, 10%, 20%)', // Dark gray for light mode text
      'text-dark': 'hsl(240, 10%, 90%)',  // Light gray for dark mode text
      'bg-light': 'hsl(0, 0%, 100%)', // Pure white for card backgrounds in light mode
      'bg-dark': 'hsl(240, 10%, 10%)', // Dark background for card backgrounds in dark mode
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
      "fade-in": {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      "blink": {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.2" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "fade-in": "fade-in 0.6s ease-out forwards",
      "blink": "blink 1.4s infinite both",
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
},
plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
