import { z } from "zod"
import { zodRotiResponse } from "../utils"
import NumberRoti from "./NumberRoti"

interface Props {
	score: z.infer<typeof zodRotiResponse>["score"]
	responses: z.infer<typeof zodRotiResponse>[]
}

const RotiStat = (props: Props) => {
	const classNameDiv = (() => {
		switch (props.score) {
			case 1:
				return "bg-red-100 "
			case 2:
				return "bg-red-50 "
			case 3:
				return "bg-yellow-50 "
			case 4:
				return "bg-green-50 "
			case 5:
				return "bg-green-100 "
		}
	})()
	const nbResponses = props.responses.length
	const nbResponsesValue = props.responses.filter(
		(response) => response.score === props.score,
	).length
	const percent = nbResponses === 0 ? 0 : (nbResponsesValue * 100) / nbResponses
	return (
		<div
			className={`${classNameDiv} w-full rounded px-4 py-2 flex items-center  shadow`}
		>
			<NumberRoti score={props.score} />
			<div className="flex flex-col items-center ml-auto">
				<p className="font-bold text-2xl text-gray-600">{nbResponsesValue}</p>
				<p className="text-lg text-gray-400">{percent.toFixed(1)}%</p>
			</div>
		</div>
	)
}

export default RotiStat
