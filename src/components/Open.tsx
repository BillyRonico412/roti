interface Props {
	open: boolean
}
const Open = (props: Props) => {
	const className = props.open
		? "border bg-green-100 border-green-500 text-green-500"
		: "border bg-red-100 border-red-500 text-red-500"
	const text = props.open ? "Ouvert" : "Fermé"
	return (
		<div className={`${className} rounded inline px-2 py-0.5 text-sm`}>
			{text}
		</div>
	)
}

export default Open
