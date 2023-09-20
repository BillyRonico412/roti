import to from "await-to-js"
import { getAuth, signOut } from "firebase/auth"
import { useCallback } from "react"
import { notyf } from "../utils"
import { useLocation } from "wouter"
import { FaPlus, FaSignOutAlt } from "react-icons/fa"

const Navbar = () => {
	const [, setLocation] = useLocation()
	const onClickSignOut = useCallback(async () => {
		const auth = getAuth()
		const [errSignOut] = await to(signOut(auth))
		if (errSignOut) {
			notyf.error("Une erreur est survenue lors de la déconnexion")
			console.error(errSignOut)
			return
		}
		notyf.success("Vous avez été déconnecté")
	}, [])
	return (
		<div className="border-b shadow">
			<div className="flex items-center px-4 py-4 container mx-auto">
				<button
					className="text-lg font-bold"
					onClick={() => {
						setLocation("/dashboard")
					}}
				>
					Roti
				</button>
				<div className="ml-auto flex gap-x-2">
					<button
						onClick={() => {
							setLocation("/create")
						}}
						className="bg-blue-600 text-white px-4 py-2 rounded-md"
					>
						<FaPlus />
					</button>
					<button
						color="red"
						onClick={onClickSignOut}
						className="bg-blue-600 text-white px-4 py-2 rounded-md"
					>
						<FaSignOutAlt />
					</button>
				</div>
			</div>
		</div>
	)
}

export default Navbar
