import { LogoutIcon, PlusIcon } from "@heroicons/react/solid"
import { Button } from "@tremor/react"
import to from "await-to-js"
import { getAuth, signOut } from "firebase/auth"
import { useCallback } from "react"
import { notyf } from "../utils"
import { useLocation } from "wouter"

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
		<div className="shadow">
			<div className="flex items-center px-4 py-2 container mx-auto">
				<a href="#" className="text-lg font-bold">
					Roti
				</a>
				<div className="ml-auto flex gap-x-4">
					<Button
						icon={PlusIcon}
						tooltip="Ajouter un roti"
						onClick={() => {
							setLocation("/create")
						}}
					/>
					<Button
						icon={LogoutIcon}
						color="red"
						tooltip="Se déconnecter"
						onClick={onClickSignOut}
					/>
				</div>
			</div>
		</div>
	)
}

export default Navbar
