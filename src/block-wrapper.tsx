import { ReactNode } from "react"

type Props = {
	children: ReactNode
}

export const BlockWrapper = (props: Props) => {
	const { children } = props

	return <div className="text-base break-words font-normal">{children}</div>
}
