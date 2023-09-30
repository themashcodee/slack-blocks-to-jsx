import React from "react"
import type { TextObject as TextObjectType } from "@/slack/types"
import { parseEmojis, parseMrkdwn } from "@/slack/utils"

type TextObjectProps = {
	data: TextObjectType
}

export const TextObject = (props: TextObjectProps) => {
	const { type, text, emoji } = props.data

	const emoji_parsed =
		type == "mrkdwn"
			? parseEmojis(text)
			: emoji === false
			? text
			: parseEmojis(text)

	if (type === "plain_text") return <div>{emoji_parsed}</div>

	return <div>{parseMrkdwn(emoji_parsed)}</div>
}
