/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B22222",
          light: "#D32F2F",
          dark: "#7A1111",
          hover: "#C23232",
        },
        secondary: {
          DEFAULT: "#F97316",
          light: "#FB923C",
          dark: "#EA580C",
        },
        customBg: {
          light: "#F8F9FB",
          dark: "#0F172A",
        },
        customCard: {
          light: "#FFFFFF",
          dark: "#1E293B",
        },
        customText: {
          light: "#111827",
          dark: "#F8FAFC",
          mutedLight: "#6B7280",
          mutedDark: "#94A3B8",
        },
        customBorder: {
          light: "#E5E7EB",
          dark: "#334155",
        }
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "sans-serif"],
      },
      boxShadow: {
        "premium": "0 4px 20px -2px rgba(17, 24, 39, 0.05), 0 2px 8px -1px rgba(17, 24, 39, 0.03)",
        "premium-hover": "0 10px 30px -5px rgba(17, 24, 39, 0.08), 0 4px 12px -2px rgba(17, 24, 39, 0.05)",
        "dark-premium": "0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 2px 8px -1px rgba(0, 0, 0, 0.2)",
      }
    },
  },
  plugins: [],
}
