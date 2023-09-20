import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useAtom } from "jotai"
import "notyf/notyf.min.css"
import { useEffect } from "react"
import { Redirect, Route, Switch } from "wouter"
import Navbar from "./components/Navbar"
import Create from "./pages/Create"
import Dashboard from "./pages/Dashboard"
import Form from "./pages/Form"
import Login from "./pages/Login"
import { userAtom } from "./utils"
import Visualize from "./pages/Visualize"

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
			<div className="w-screen h-screen">
				<Switch>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/form/:uid/:rotiid">
						{(params) => <Form uid={params.uid} rotiid={params.rotiid} />}
					</Route>
					<Redirect to="/login" />
				</Switch>
			</div>
		)
	}

	return (
		<div className="flex flex-col w-screen h-screen">
			<Navbar />
			<div className="flex-grow bg-gray-100 overflow-x-auto overflow-y-auto">
				<Switch>
					<Route path="/dashboard">
						<Dashboard />
					</Route>
					<Route path="/create">
						<Create />
					</Route>
					<Route path="/form/:uid/:rotiid">
						{(params) => <Form rotiid={params.rotiid} uid={params.uid} />}
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
