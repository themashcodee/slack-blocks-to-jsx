export const formatMessageTime = (timestamp: Date) => {
	const date = new Date(timestamp)

	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}
export const dateToTime = (timestamp: Date) => {
	const date = new Date(timestamp)

	return date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	})
}
