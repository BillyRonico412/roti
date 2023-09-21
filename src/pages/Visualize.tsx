import to from "await-to-js"
import { getDatabase, off, onValue, ref, set } from "firebase/database"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { FaClipboard, FaLock, FaTrashAlt, FaUnlock } from "react-icons/fa"
import { useLocation } from "wouter"
import { z } from "zod"
import Comment from "../components/Comment"
import RotiStat from "../components/RotiStat"
import { notyf, userAtom, zodRoti } from "../utils"

interface Props {
	rotiid: string
}

const Visualize = (props: Props) => {
	const [user] = useAtom(userAtom)
	const [, setLocation] = useLocation()

	const [roti, setRoti] = useState<z.infer<typeof zodRoti> | null | undefined>(
		undefined,
	)

	useEffect(() => {
		if (!user) {
			return
		}
		const db = getDatabase()
		const rotiRef = ref(db, `${user.uid}/rotis/${props.rotiid}`)
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
	}, [user, props.rotiid])

	const onClickOpen = async (open: boolean) => {
		if (!user) {
			notyf.error("Vous devez être connecté pour modifier le roti")
			return
		}
		const db = getDatabase()
		const rotiRef = ref(db, `${user.uid}/rotis/${props.rotiid}`)
		const [errSet] = await to(set(rotiRef, { ...roti, open }))
		if (errSet) {
			notyf.error("Une erreur est survenue lors de la modification du roti")
			console.error(errSet)
			return
		}
		notyf.success("Le roti a été modifié")
	}

	const onClickDelete = async () => {
		if (!user) {
			notyf.error("Vous devez être connecté pour supprimer le roti")
			return
		}
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce roti ?")) {
			return
		}
		const db = getDatabase()
		const rotiRef = ref(db, `${user.uid}/rotis/${props.rotiid}`)
		const [errSet] = await to(set(rotiRef, null))
		if (errSet) {
			notyf.error("Une erreur est survenue lors de la suppression du roti")
			console.error(errSet)
			return
		}
		notyf.success("Le roti a été supprimé")
		setLocation("/dashboard")
	}

	if (!(roti && user)) {
		return <></>
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center flex-col gap-y-2 lg:flex-row">
				<p className="font-bold text-lg">{roti.label}</p>
				<div className="flex flex-col gap-y-4 w-full lg:w-auto lg:ml-auto">
					<div className="w-full rounded flex overflow-hidden shadow">
						<button
							className="px-4 bg-red-600 text-white"
							onClick={onClickDelete}
						>
							<FaTrashAlt />
						</button>
						<p className="bg-white px-4 py-2 text-sm text-gray-500 flex-grow truncate">
							{window.location.origin}/form/{user.uid}/{props.rotiid}
						</p>
						<button
							className="px-4 bg-blue-600 text-white"
							onClick={() => {
								navigator.clipboard.writeText(
									`${window.location.origin}/form/${user.uid}/${props.rotiid}`,
								)
								notyf.success("Lien copié dans le presse papier")
							}}
						>
							<FaClipboard />
						</button>
					</div>
					<div className="ml-auto border rounded flex overflow-hidden w-full lg:w-auto">
						<button
							className={`border-r px-4 py-2 flex justify-center items-center gap-x-2 w-full lg:w-auto ${
								roti.open ? "bg-white" : "bg-red-100"
							}`}
							onClick={() => {
								onClickOpen(false)
							}}
						>
							Fermé <FaLock />
						</button>
						<button
							className={`px-4 py-2 flex justify-center items-center gap-x-2 bg-green-100 w-full lg:w-auto ${
								roti.open ? "bg-green-100" : "bg-white"
							}`}
							onClick={() => {
								onClickOpen(true)
							}}
						>
							Ouvert <FaUnlock />
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col lg:flex-row gap-x-4 gap-y-4 justify-center mt-4">
				<RotiStat
					score={1}
					responses={roti.responses ? Object.values(roti.responses) : []}
				/>
				<RotiStat
					score={2}
					responses={roti.responses ? Object.values(roti.responses) : []}
				/>
				<RotiStat
					score={3}
					responses={roti.responses ? Object.values(roti.responses) : []}
				/>
				<RotiStat
					score={4}
					responses={roti.responses ? Object.values(roti.responses) : []}
				/>
				<RotiStat
					score={5}
					responses={roti.responses ? Object.values(roti.responses) : []}
				/>
			</div>
			{roti.responses &&
				Object.values(roti.responses).some((response) => response.comment) && (
					<div className="flex flex-col gap-y-4 mt-8">
						<p className="font-bold text-lg">Commentaires</p>
						{roti.responses &&
							Object.entries(roti.responses).map(([responseId, response]) => (
								<Comment key={responseId} response={response} />
							))}
					</div>
				)}
		</div>
	)
}

export default Visualize
