import to from "await-to-js"
import { getDatabase, off, onValue, push, ref, set } from "firebase/database"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { FaExclamationTriangle, FaLock } from "react-icons/fa"
import { z } from "zod"
import NumberRoti from "../components/NumberRoti"
import {
	alreadyRespondedAtom,
	classNameDivRoti,
	notyf,
	zodRoti,
	zodRotiResponse,
} from "../utils"

interface Props {
	uid: string
	rotiid: string
}

const Form = (props: Props) => {
	const [scoreCurrent, setScoreCurrent] = useState<
		z.infer<typeof zodRotiResponse>["score"] | null
	>(null)
	const className = (score: z.infer<typeof zodRotiResponse>["score"]) =>
		`px-4 p-2 rounded shadow font-medium flex items-center gap-x-4 cursor-pointer ${
			score !== scoreCurrent
				? "bg-white hover:bg-gray-50"
				: classNameDivRoti(score)
		}`
	const onClickScore = (score: z.infer<typeof zodRotiResponse>["score"]) => {
		setScoreCurrent(score)
	}

	const [comment, setComment] = useState<string>("")

	const [roti, setRoti] = useState<z.infer<typeof zodRoti> | null>(null)

	useEffect(() => {
		const db = getDatabase()
		const rotiRef = ref(db, `${props.uid}/rotis/${props.rotiid}`)
		onValue(rotiRef, (snapshot) => {
			const roti = snapshot.val()
			if (!roti) {
				return
			}
			const testZod = zodRoti.safeParse(roti)
			if (!testZod.success) {
				notyf.error("Une erreur est survenue lors de la récupération du roti")
				console.error(testZod.error)
				return
			}
			setRoti(testZod.data)
		})
		return () => {
			off(rotiRef)
		}
	}, [props.rotiid, props.uid])

	const [alreadyResponded, setAlreadyResponded] = useAtom(alreadyRespondedAtom)

	const onClickValier = async () => {
		if (scoreCurrent === null) {
			notyf.error("Veuillez sélectionner une note")
			return
		}
		const rotiResponse: z.infer<typeof zodRotiResponse> = {
			score: scoreCurrent,
			comment: comment === "" ? null : comment,
		}
		const db = getDatabase()
		const rotiResponseRef = ref(
			db,
			`${props.uid}/rotis/${props.rotiid}/responses`,
		)
		const newRotiResponseRef = push(rotiResponseRef)
		const [errSet] = await to(set(newRotiResponseRef, rotiResponse))
		if (errSet) {
			notyf.error("Une erreur est survenue lors de l'envoi de la réponse")
			console.error(errSet)
			return
		}
		notyf.success("Votre réponse a été envoyé")
		setAlreadyResponded(true)
	}

	if (!roti) {
		return (
			<div className="flex w-full h-full">
				<div className="mx-auto my-auto bg-red-100 border border-red-400 text-lg font-medium px-8 py-4 rounded text-red-600 shadow shadow-red-300 flex items-center gap-x-4">
					La page n'existe pas
					<FaExclamationTriangle />
				</div>
			</div>
		)
	}

	if (!roti.open) {
		return (
			<div className="flex w-full h-full">
				<div className="mx-auto my-auto bg-yellow-100 border border-yellow-400 text-lg font-medium px-8 py-4 rounded text-yellow-600 shadow shadow-yellow-300 flex items-center gap-x-4">
					La page est fermé
					<FaLock />
				</div>
			</div>
		)
	}

	if (alreadyResponded) {
		return (
			<div className="flex w-full h-full">
				<div className="mx-auto my-auto bg-green-100 border border-green-400 text-lg font-medium px-8 py-4 rounded text-green-600 shadow shadow-green-300 flex items-center gap-x-4">
					Vous avez déjà répondu
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col gap-y-4">
				<div className={`${className(1)}`} onClick={() => onClickScore(1)}>
					<NumberRoti score={1} />
					Inutile. Je n'ai rien gagné, rien appris
				</div>
				<div className={`${className(2)}`} onClick={() => onClickScore(2)}>
					<NumberRoti score={2} />
					Utile mais ça ne valait pas à 100% le temps que j'y ai passé
				</div>
				<div className={`${className(3)}`} onClick={() => onClickScore(3)}>
					<NumberRoti score={3} />
					Juste Moyenne. Je n'ai pas perdu mon temps, sans plus
				</div>
				<div className={`${className(4)}`} onClick={() => onClickScore(4)}>
					<NumberRoti score={4} />
					Bonne. J'ai gagné plus que le temps que j'y ai passé
				</div>
				<div className={`${className(5)}`} onClick={() => onClickScore(5)}>
					<NumberRoti score={5} />
					Excellente. Ça valait bien plus que le temps qu'on y a passé
				</div>
			</div>
			<textarea
				rows={2}
				className="w-full shadow border rounded mt-8 px-4 py-2"
				placeholder="Commentaire"
				value={comment}
				onInput={(e) => {
					if (e.currentTarget.value.length > 500) {
						notyf.error("Le commentaire ne peut pas dépasser 500 caractères")
						return
					}
					setComment(e.currentTarget.value)
				}}
			/>
			<button
				className="bg-blue-600 rounded px-4 py-2 mt-8 text-white font-bold"
				onClick={onClickValier}
			>
				Envoyer
			</button>
		</div>
	)
}

export default Form
