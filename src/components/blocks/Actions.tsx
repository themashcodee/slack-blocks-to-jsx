import { ActionsBlock } from "../../types"
import { ButtonElement, StaticSelectElement } from "../elements"

type ActionsProps = {
	data: ActionsBlock
}

export const Actions = (props: ActionsProps) => {
	const { elements, block_id } = props.data

	return (
		<div
			id={block_id}
			className="mb-2 text-primary flex w-full text-black-primary items-center"
		>
			<div className="flex flex-wrap">
				{elements.map((element, i) => {
					if (element.type === "button") {
						return (
							<div key={i} className="mt-2 mr-2">
								<ButtonElement data={element} />
							</div>
						)
					}

					if (element.type === "static_select") {
						return (
							<div key={i} className="mt-2 mr-2">
								<StaticSelectElement data={element} />
							</div>
						)
					}

					// TODO: HANDLE OTHER ELEMENTS
					return <div key={i} className="mt-2 mr-2"></div>
				})}
			</div>
		</div>
	)
}
