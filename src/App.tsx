import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { Redirect, Route, Switch } from "wouter"
import Dashboard from "./pages/Dashboard"
import Form from "./pages/Form"
import Login from "./pages/Login"
import Visualize from "./pages/Visualize"
import { userAtom } from "./utils"
import "notyf/notyf.min.css"
import Navbar from "./components/Navbar"
import Create from "./pages/Create"

const App = () => {
	const [user, setUser] = useAtom(userAtom)

	useEffect(() => {
		const auth = getAuth()
		onAuthStateChanged(auth, (user) => {
			setUser(user)
		})
	}, [setUser])

	if (user === undefined) {
		return <></>
	}

	if (user === null) {
		return (
			<Switch>
				<Route path="/login">
					<Login />
				</Route>
				<Route path="/form/:rotiid">
					{(params) => <Form rotiid={params.rotiid} />}
				</Route>
				<Redirect to="/login" />
			</Switch>
		)
	}

	return (
		<div className="flex flex-col w-screen h-screen">
			<Navbar />
			<div className="flex-grow">
				<Switch>
					<Route path="/dashboard">
						<Dashboard />
					</Route>
					<Route path="/create">
						<Create />
					</Route>
					<Route path="/form/:rotiid">
						{(params) => <Form rotiid={params.rotiid} />}
					</Route>
					<Route path="/visualize/:rotiid">
						{(params) => <Visualize rotiid={params.rotiid} />}
					</Route>
					<Redirect to="/dashboard" />
				</Switch>
			</div>
		</div>
	)
}

export default App
