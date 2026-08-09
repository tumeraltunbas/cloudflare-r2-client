/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"color-background": "#404041",
				"color-primary": "#f48120",
				"color-secondary": "#faad3f",
			},
			fontFamily: {
				montserrat: ["Montserrat"],
				lato: ["Lato"],
				garamond: ["Garamond"],
			},
		},
	},
	plugins: [],
};
