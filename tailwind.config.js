/** @type {import('tailwindcss').Config} */
module.exports = {
	important:"#slack_blocks_to_jsx",
	darkMode: ['selector', '[data-theme="dark"]'],
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
				orange: {
					primary: "rgb(232, 145, 45)",
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
				broadcast: {
					text: "rgb(29, 28, 29)",
					bg: "rgba(244, 196, 0, 0.18)",
				},
				dark: {
					bg: {
						primary: "rgb(26, 29, 33)",
						secondary: "rgb(35, 37, 39)",
					},
					text: {
						primary: "rgb(209, 210, 211)",
						secondary: "rgb(171, 172, 173)",
						max: "rgb(154, 156, 158)",
						high: "rgb(117, 119, 122)",
						low: "rgb(50, 53, 56)",
						min: "rgb(33, 36, 40)",
					},
					border: "rgb(84, 84, 84)",
					link: "rgb(29, 155, 209)",
					code: {
						bg: "rgb(33, 36, 40)",
						border: "rgb(50, 53, 56)",
					},
					user: {
						bg: "rgba(29, 155, 209, 0.2)",
						text: "rgb(29, 155, 209)",
					},
					broadcast: {
						text: "rgb(222, 167, 0)",
						bg: "rgba(222, 167, 0, 0.18)",
					},
				},
			},
			fontSize: {
				"small": ["13px", "1.38461538"],
				"base": ["15px", "1.46668"],
				"header": ["18px", "1.33334"],
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
