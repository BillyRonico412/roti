import { z } from "zod"
import { zodRoti } from "../utils"
import Open from "./Open"
import { useLocation } from "wouter"
import dayjs from "dayjs"

interface Props {
	roti: z.infer<typeof zodRoti>
	rotiId: string
}

const Roti = (props: Props) => {
	const [, setLocation] = useLocation()
	const nbResponses = (() => {
		if (!props.roti.responses) {
			return 0
		}
		return Object.keys(props.roti.responses).length
	})()
	const average = (() => {
		if (!props.roti.responses) {
			return 0
		}
		return (
			Object.values(props.roti.responses).reduce(
				(acc, curr) => acc + curr.score,
				0,
			) / nbResponses
		)
	})()

	const classTd = "text-center border-t py-3 px-4"

	return (
		<tr>
			<td className={`${classTd} font-medium`}>{props.roti.label}</td>
			<td className={`${classTd} text-gray-500 text-sm`}>
				{dayjs(props.roti.date).format("DD/MM/YYYY")}
			</td>
			<td className={`${classTd} text-gray-500 text-sm`}>{nbResponses}</td>
			<td className={`${classTd} text-gray-500 text-sm`}>
				{average.toFixed(2)}
			</td>
			<td className={`${classTd} text-gray-500 text-sm`}>
				<Open open={props.roti.open} />
			</td>
			<td className={`${classTd} text-gray-500 text-sm`}>
				<button
					className="text-blue-500 font-medium"
					onClick={() => {
						setLocation(`/visualize/${props.rotiId}`)
					}}
				>
					Visualiser
				</button>
			</td>
		</tr>
	)
}

export default Roti
