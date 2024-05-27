/** @type {import('tailwindcss').Config} */
module.exports = {
	important:"#slack_blocks_to_jsx",
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				white: {
					primary: "#ffffff",
					"secondary": "#f8f8f8",
				},
				"custom_shadow": {
					"1": "rgba(29, 28, 29, 0.13) 0px 0px 0px 1px, rgba(0, 0, 0, 0.12) 0px 5px 10px 0px",
				},
				black: {
					primary: "rgb(29, 28, 29)",
					"primary.3": "rgba(29, 28, 29, 0.3)",
					secondary: "rgb(97, 96, 97)",
				},
				gray: {
					primary: "rgb(221,221,221)",
					secondary: "rgb(246,246,246)",
				},
				red: {
					primary: " rgb(224, 30, 90)",
					"primary.3": "rgba(224, 30, 90, 0.3)",
				},
				blue: {
					primary: "rgb(18,100,163)",
					secondary: "rgb(11, 76, 140)"
				},
				green: {
					primary: "rgb(0, 122, 90)",
					"primary.3": "rgba(0, 122, 90, 0.3)",
					secondary:"rgb(32, 162, 113)"
				},
			},
			fontSize: {
				"small": ["13px", "1.38461538"],
				"base": ["15px", "1.46668"],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
}
