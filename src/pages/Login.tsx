import to from "await-to-js"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { useAtom } from "jotai"
import { useCallback } from "react"
import { notyf, userAtom } from "../utils"
import { FaGoogle } from "react-icons/fa"

const provider = new GoogleAuthProvider()

const Login = () => {
	const [, setUser] = useAtom(userAtom)

	const onClickLogin = useCallback(async () => {
		const auth = getAuth()
		auth.languageCode = "fr"
		const [errSignInResult, signInResult] = await to(
			signInWithPopup(auth, provider),
		)
		if (errSignInResult) {
			notyf.error("Une erreur est survenue lors de la connexion")
			console.error(errSignInResult)
			return
		}
		setUser(signInResult.user)
		notyf.success("Vous êtes connecté")
	}, [setUser])

	return (
		<div className="flex w-screen h-screen">
			<div className="mx-auto my-auto flex flex-col gap-y-4">
				<p className="text-center">
					<span className="font-bold text-2xl">R</span>
					<span>eturn</span> <span className="font-bold text-2xl">O</span>
					<span>n</span> <span className="font-bold text-2xl">T</span>
					<span>ime</span> <span className="font-bold text-2xl">I</span>
					<span>nvested</span>
				</p>
				<button
					onClick={onClickLogin}
					className="flex items-center gap-x-4 bg-blue-600 px-4 py-2 rounded-md text-white"
				>
					Se connecter avec Google <FaGoogle />
				</button>
			</div>
		</div>
	)
}

export default Login
