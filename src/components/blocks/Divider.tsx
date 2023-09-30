import React from "react"
import { DividerBlock } from "../../types"

type DividerProps = {
	data: DividerBlock
}

export const Divider = (props: DividerProps) => {
	const { data } = props
	const { block_id } = data

	return (
		<div
			id={block_id}
			className="border-b border-gray-primary border-solid w-full mt-1 mb-2"
		></div>
	)
}
