import { useLocation } from "wouter"
import { zodRoti } from "../utils"
import { z } from "zod"
import dayjs from "dayjs"
import Open from "./Open"

interface Props {
	roti: z.infer<typeof zodRoti>
	rotiId: string
}

const RotiMobile = (props: Props) => {
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

	return (
		<div
			className="bg-white px-4 py-8 flex flex-col gap-y-2 cursor-pointer"
			onClick={() => {
				setLocation(`/visualize/${props.rotiId}`)
			}}
		>
			<div className="flex items-center gap-x-4">
				<span className="font-semibold">Label:</span>{" "}
				<hr className="h-1 flex-grow border-opacity-10" />
				<span className="text-gray-500">{props.roti.label}</span>
			</div>
			<div className="flex items-center gap-x-4">
				<span className="font-semibold">Date:</span>{" "}
				<hr className="h-1 flex-grow border-opacity-10" />
				<span className="text-gray-500 text-sm">
					{dayjs(props.roti.date).format("DD/MM/YYYY")}
				</span>
			</div>
			<div className="flex items-center gap-x-4">
				<span className="font-semibold">Reponses:</span>{" "}
				<hr className="h-1 flex-grow border-opacity-10" />
				<span className="text-gray-500 text-sm">{nbResponses}</span>
			</div>
			<div className="flex items-center gap-x-4">
				<span className="font-semibold">Moyenne:</span>{" "}
				<hr className="h-1 flex-grow border-opacity-10" />
				<span className="text-gray-500 text-sm">{average.toFixed(2)}</span>
			</div>
			<div className="flex items-center gap-x-4">
				<span className="font-semibold">Status:</span>{" "}
				<hr className="h-1 flex-grow border-opacity-10" />
				<span className="text-gray-500">
					<Open open={props.roti.open} />
				</span>
			</div>
		</div>
	)
}

export default RotiMobile
