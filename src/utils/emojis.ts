import { emojify } from "node-emoji"

const missing_emojis: {
	[key: string]: string
} = {
	"heart_hands": "🫶",
	"white_frowning_face": "🙁",
}

export const parseEmojis = (text: string) => {
	return emojify(text, (name) => missing_emojis[name] ?? `:${name}:`)
}
