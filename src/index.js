import React, { useState } from "react"
import ReactDOM from "react-dom"
import logo from "./assets/logo.svg"
import Modal from "./components/modal"

const App = () => {
	const [showLogin, setShowLogin] = useState(false)
	const [showRegister, setShowRegister] = useState(false)

	const openLogin = () => setShowLogin(true)
	const closeLogin = () => setShowLogin(false)
	const openRegister = () => setShowRegister(true)
	const closeRegister = () => setShowRegister(false)

	return (
		<div>
			<img src={logo} alt="Booker Logo" />
			<h1>Booker</h1>
			<div>
				<button onClick={openLogin}>Login</button>
			</div>
			<div>
				<button onClick={openRegister}>Register</button>
			</div>

			<Modal isOpen={showLogin} onDismiss={closeLogin} title={"Login"} />
			<Modal
				isOpen={showRegister}
				onDismiss={closeRegister}
				title={"Register"}
			/>
		</div>
	)
}

ReactDOM.render(<App />, document.querySelector("#root"))

if (module.hot) {
	module.hot.accept()
}
