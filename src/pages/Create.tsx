import to from "await-to-js"
import { getDatabase, push, ref, set } from "firebase/database"
import { useAtom } from "jotai"
import { useCallback, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { useLocation } from "wouter"
import { z } from "zod"
import { notyf, userAtom, zodRoti } from "../utils"

const Create = () => {
	const [label, setLabel] = useState("")
	const [, setLocation] = useLocation()
	const [user] = useAtom(userAtom)
	const onClickCreate = useCallback(async () => {
		if (!user) {
			notyf.error("Vous devez être connecté pour créer un roti")
			return
		}
		if (label === "") {
			notyf.error("Le label ne peut pas être vide")
			return
		}
		const roti: z.infer<typeof zodRoti> = {
			label,
			date: Date.now(),
			open: true,
		}
		const db = getDatabase()
		const rotiRef = ref(db, `${user.uid}/rotis/`)
		const newRotiRef = push(rotiRef)
		const [errSet] = await to(set(newRotiRef, roti))
		if (errSet) {
			notyf.error("Une erreur est survenue lors de la création du roti")
			console.error(errSet)
			return
		}
		notyf.success("Le roti a été créé")
		setLabel("")
		setLocation(`/visualize/${newRotiRef.key}`)
	}, [label, user, setLocation])
	return (
		<div className="flex container mx-auto h-full px-4">
			<div className="my-auto flex gap-x-4 w-full">
				<input
					placeholder="Label du roti"
					className="px-4 py-2 rounded-md flex-grow"
					value={label}
					onInput={(e) => {
						if (e.currentTarget.value.length > 50) {
							notyf.error("Le label ne peut pas dépasser 50 caractères")
							return
						}
						setLabel(e.currentTarget.value)
					}}
				/>
				<button
					className="bg-green-500 px-4 py-2 rounded-md text-white"
					onClick={onClickCreate}
				>
					<FaPlus />
				</button>
			</div>
		</div>
	)
}

export default Create
