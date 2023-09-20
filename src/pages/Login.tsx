import { Button } from "@tremor/react"
import to from "await-to-js"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { useAtom } from "jotai"
import { useCallback } from "react"
import { notyf, userAtom } from "../utils"
import { LoginIcon } from "@heroicons/react/solid"

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
			<div className="mx-auto my-auto">
				<Button onClick={onClickLogin} icon={LoginIcon} iconPosition="right">
					Se connecter avec Google
				</Button>
			</div>
		</div>
	)
}

export default Login
