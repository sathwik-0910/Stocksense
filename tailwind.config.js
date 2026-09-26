/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0A0A0B",
          surface: "#141416",
          elevated: "#1C1C1F",
          hover: "#222226",
          border: "rgba(255,255,255,0.08)",
        },
        accent: {
          blue: "#3B82F6",
          "blue-dim": "#1D4ED8",
          emerald: "#10B981",
          "emerald-dim": "#059669",
        },
        status: {
          draft: "#6B7280",
          waiting: "#F59E0B",
          ready: "#3B82F6",
          done: "#10B981",
          cancelled: "#EF4444",
          lowstock: "#F97316",
          outofstock: "#EF4444",
        },
        muted: "#6B7280",
        subtle: "#374151",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-up": "slideInUp 0.3s ease-out",
        "count-up": "countUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "mesh-move": "meshMove 8s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(59,130,246,0.15)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(59,130,246,0.25)" },
        },
        meshMove: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
      },
    },
  },
  plugins: [],
};
