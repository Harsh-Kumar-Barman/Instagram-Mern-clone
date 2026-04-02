// /** @type {import('tailwindcss').Config} */
// export default {
//     darkMode: ["media","class"],
//     content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//   	extend: {
//   		borderRadius: {
//   			lg: 'var(--radius)',
//   			md: 'calc(var(--radius) - 2px)',
//   			sm: 'calc(var(--radius) - 4px)'
//   		},
//   		colors: {}
//   	}
//   },
//   plugins: [require("tailwindcss-animate")],
// }

import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        error: "var(--error)",
        "error-container": "var(--error-container)",
        "on-background": "var(--on-background)",
        "on-surface": "var(--on-surface)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        surface: "var(--surface)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-dim": "var(--surface-dim)",
        tertiary: "var(--tertiary)",
      },
      borderColor: {
        DEFAULT: "var(--surface-container-highest)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      boxShadow: {
        ambient: "0 0 32px 0 var(--shadow-ambient)",
      }
    },
  },
  plugins: [tailwindAnimate], // ✅ Use ESM import
};
