/** @jsx jsx */
import {css, jsx} from "@emotion/react"

import "bootstrap/dist/css/bootstrap-reboot.css"
import "./index.css"

import * as React from "react"
import ReactDOM from "react-dom"

import logo from "./assets/logo.svg"
import Modal from "./components/Modal"
import {Button} from "./components/lib"

/** @jsxRuntime classic */
/** @jsx jsx */
const App = () => {
	const [showDialog, setShowDialog] = React.useState("none")
	
	const handleSubmit = (fieldName) => (formData) =>
		console.log(fieldName, formData)

	return (
		<div
			css={css`
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				width: 100%;
				height: 100vh;
			`}
		>
			<img src={logo} alt="Booker Logo" />
			<h1>簿客</h1>
			<div
				css={css`
					display: grid;
					grid-template-columns: repeat(2, minmax(0px, 1fr));
					gap: 0.75rem;
				`}
			>
				<Button
					variant="primary"
					onClick={() => setShowDialog("login")}
				>
					登录
				</Button>
				<Button
					variant="secondary"
					onClick={() => setShowDialog("register")}
				>
					注册
				</Button>
			</div>

			<Modal
				isOpen={showDialog === "login"}
				onDismiss={() => setShowDialog("none")}
				title={"登录"}
				variant="primary"
				onsubmit={handleSubmit("登录")}
			/>
			<Modal
				isOpen={showDialog === "register"}
				onDismiss={() => setShowDialog("none")}
				title={"注册"}
				variant="secondary"
				onsubmit={handleSubmit("注册")}
			/>
		</div>
	)
}

ReactDOM.render(<App />, document.querySelector("#root"))

if (module.hot) {
	module.hot.accept()
}
