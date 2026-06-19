/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        "navy-deep": "var(--navy-deep)",
        "aqua-turquoise": "var(--aqua-turquoise)",
        "soft-white": "var(--soft-white)",
        "warm-coral": "var(--warm-coral)",
        aqua: {
          50: 'var(--aqua-50)',
          100: 'var(--aqua-100)',
          200: 'var(--aqua-200)',
          300: 'var(--aqua-300)',
          400: 'var(--aqua-400)',
          500: 'var(--aqua-500)',
          600: 'var(--aqua-600)',
          700: 'var(--aqua-700)',
          800: 'var(--aqua-800)',
          900: 'var(--aqua-900)',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
