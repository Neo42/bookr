import React, { useState } from "react"
import ReactDOM from "react-dom"
import logo from "./assets/logo.svg"
import Modal from "./components/Modal"

const App = () => {
	const [showDialog, setShowDialog] = useState("false")

	return (
		<div>
			<img src={logo} alt="Booker Logo" />
			<h1>Booker</h1>
			<div>
				<button onClick={() => setShowDialog("login")}>Login</button>
			</div>
			<div>
				<button onClick={() => setShowDialog("register")}>
					Register
				</button>
			</div>

			<Modal
				isOpen={showDialog === "login"}
				onDismiss={() => setShowDialog("none")}
				title={"Login"}
			/>
			<Modal
				isOpen={showDialog === "register"}
				onDismiss={() => setShowDialog("none")}
				title={"Register"}
			/>
		</div>
	)
}

ReactDOM.render(<App />, document.querySelector("#root"))

if (module.hot) {
	module.hot.accept()
}
