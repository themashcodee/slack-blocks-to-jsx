import { ReactNode } from "react"
import { Block } from "../types"

import { Divider, Image, Section, Context, Actions } from "./blocks"

export const getBlockComponent = (block: Block): ReactNode => {
	if (block.type === "divider") return <Divider data={block} />
	if (block.type === "section") return <Section data={block} />
	// eslint-disable-next-line jsx-a11y/alt-text
	if (block.type === "image") return <Image data={block} />
	if (block.type === "context") return <Context data={block} />
	if (block.type === "actions") return <Actions data={block} />
	return null
}
