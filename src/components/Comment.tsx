import { z } from "zod"
import { zodRotiResponse } from "../utils"

interface Props {
	response: z.infer<typeof zodRotiResponse>
}

const Comment = (props: Props) => {
	if (!props.response.comment) {
		return <></>
	}
	return (
		<div className="bg-white border shadow rounded px-4 py-3">
			<p className="text-gray-600">{props.response.comment}</p>
		</div>
	)
}

export default Comment
