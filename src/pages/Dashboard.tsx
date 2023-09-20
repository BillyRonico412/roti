import { getDatabase, off, onValue, ref } from "firebase/database"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { z } from "zod"
import Roti from "../components/Roti"
import { notyf, userAtom, zodRoti } from "../utils"
import RotiMobile from "../components/RotiMobile"

const Dashboard = () => {
	const [rotis, setRotis] = useState<Record<
		string,
		z.infer<typeof zodRoti>
	> | null>(null)

	const [user] = useAtom(userAtom)

	useEffect(() => {
		if (!user) {
			return
		}
		const db = getDatabase()
		const rotisRef = ref(db, `${user.uid}/rotis`)
		onValue(rotisRef, (snapshot) => {
			const rotis = snapshot.val()
			if (!rotis) {
				return
			}
			const testZod = z.record(zodRoti).safeParse(rotis)
			if (!testZod.success) {
				notyf.error("Une erreur est survenue lors de la récupération des rotis")
				console.error(testZod.error)
				return
			}
			setRotis(testZod.data)
		})
		return () => {
			off(rotisRef)
		}
	}, [user])

	const classTh = "py-3 px-6 font-bold text-lg text-sm text-gray-500"
	return (
		<div className="container h-full mx-auto px-4 py-8">
			<table className="w-full border shadow rounded border-collapse bg-white overflow-hidden hidden lg:table">
				<thead>
					<tr className="bg-gray-50">
						<th className={classTh}>Label</th>
						<th className={classTh}>Date</th>
						<th className={classTh}>Reponses</th>
						<th className={classTh}>Moyenne</th>
						<th className={classTh}>Status</th>
						<th className={classTh}>Action</th>
					</tr>
				</thead>
				<tbody>
					{rotis &&
						Object.entries(rotis).map(([rotiId, roti]) => (
							<Roti key={rotiId} roti={roti} rotiId={rotiId} />
						))}
				</tbody>
			</table>
			<div className="lg:hidden">
				{rotis &&
					Object.entries(rotis).map(([rotiId, roti]) => (
						<RotiMobile key={rotiId} roti={roti} rotiId={rotiId} />
					))}
			</div>
		</div>
	)
}

export default Dashboard
