import { SectionBlock } from "../../types"
import Image from "next/image"
import { TextObject } from "../elements"

type SectionProps = {
	data: SectionBlock
}

export const Section = (props: SectionProps) => {
	const { accessory, fields, text, block_id } = props.data

	return (
		<div
			id={block_id}
			className="mt-2 mb-1 text-primary flex w-full text-black-primary"
		>
			<div className="grow">
				<div className="flex flex-col gap-3">
					{text && <TextObject data={text} />}

					{fields && (
						<div className="grid grid-col-2 w-full">
							{fields.map((field, i) => {
								return <TextObject key={i} data={field} />
							})}
						</div>
					)}
				</div>
			</div>

			{/* HANDLE OTHER ACCESORIES */}
			{accessory && accessory.type === "image" && (
				<div className="ml-2 mb-1 relative shrink-0">
					<Image
						height={88}
						width={88}
						src={accessory.image_url}
						alt={accessory.alt_text}
						className="w-[88px] h-[88px] object-cover ml-1 rounded-[8px] overflow-hidden"
					/>
				</div>
			)}
		</div>
	)
}
