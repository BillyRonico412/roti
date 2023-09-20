interface Props {
	score: number
}

const NumberRoti = (props: Props) => {
	const classNameNumber = (() => {
		switch (props.score) {
			case 1:
				return "bg-red-500"
			case 2:
				return "bg-red-400"
			case 3:
				return "bg-yellow-400"
			case 4:
				return "bg-green-400"
			case 5:
				return "bg-green-500"
		}
	})()
	return (
		<p
			className={`${classNameNumber} w-10 aspect-square text-xl font-black flex justify-center items-center rounded text-white`}
		>
			{props.score}
		</p>
	)
}

export default NumberRoti
