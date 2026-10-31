/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// Brand orange. `orange`/`-bright`/`-deep` are button fills;
				// `-tint` is a selected background and `-text` is the readable
				// orange for links and active labels on dark surfaces.
				// `-tint` is deliberately deep: it is a background for grey
				// body text, which has to stay above 4.5:1 on it.
				cloudflare: {
					orange: "#F6821F",
					"orange-bright": "#FF9A3D",
					"orange-deep": "#C25E0A",
					"orange-tint": "#25170C",
					"orange-text": "#FFAE63",
					amber: "#FBAD41",
				},
				// Text ramp: higher number = stronger text, lower = fainter.
				// Every step from 500 up clears 4.5:1 on all four surfaces.
				// 950 is the near-black used for text sitting on brand orange.
				ink: {
					950: "#0B0B0F",
					900: "#F5F5F7",
					800: "#E6E6EB",
					700: "#D2D2DA",
					600: "#A9A9B6",
					500: "#9494A1",
					400: "#7A7A88",
					300: "#6A6A78",
					200: "#33333D",
				},
				line: "#2E2E38",
				// Elevation ladder: canvas is the page, then cards, then the
				// raised strips inside them (table headers, modal footers).
				surface: {
					DEFAULT: "#16161B",
					canvas: "#0B0B0F",
					raised: "#1E1E24",
					overlay: "#26262E",
				},
				danger: {
					600: "#C93B2E",
					700: "#D9483A",
					light: "#3A1A17",
				},
				success: {
					600: "#2EA36B",
					light: "#12291F",
				},
				// Legacy aliases kept so existing class names keep resolving.
				"color-background": "#0B0B0F",
				"color-primary": "#F6821F",
				"color-secondary": "#FBAD41",
			},
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
				lato: ["Lato", "sans-serif"],
				garamond: ["Garamond", "serif"],
			},
			boxShadow: {
				card: "0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.35)",
				pop: "0 16px 40px -12px rgba(0, 0, 0, 0.75), 0 2px 8px rgba(0, 0, 0, 0.5)",
			},
			keyframes: {
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"scale-in": {
					from: { opacity: "0", transform: "translateY(6px) scale(0.98)" },
					to: { opacity: "1", transform: "translateY(0) scale(1)" },
				},
			},
			animation: {
				"fade-in": "fade-in 150ms ease-out",
				"scale-in": "scale-in 180ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [],
};
