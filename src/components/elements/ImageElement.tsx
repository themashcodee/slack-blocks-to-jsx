import React from "react"
import type { ImageElement as ImageElementType } from "@/slack/types"
import { parseEmojis, parseMrkdwn } from "@/slack/utils"
import Image from "next/image"

type ImageElementProps = {
	data: ImageElementType
}

export const ImageElement = (props: ImageElementProps) => {
	const { alt_text, image_url } = props.data

	return (
		<div className="relative w-6 h-[25.25px]">
			<Image
				src={image_url}
				height={20}
				width={20}
				className="w-5 h-5 object-cover rounded-[2px] overflow-hidden"
				alt={alt_text}
			/>
		</div>
	)
}
