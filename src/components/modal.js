import React from "react"
import Dialog from "@reach/dialog"
import "@reach/dialog/styles.css"
import Form from "./Form"

export default function Modal({ isOpen, onDismiss, title }) {
	return (
		<Dialog
			onDismiss={onDismiss}
			isOpen={isOpen}
			aria-label={`${title} form`}
		>
			<div>
				<button onClick={onDismiss}>Close</button>
			</div>
			<h3>{title}</h3>
			<Form
				buttonText={title}
				onsubmit={(user) => console.log(title, user)}
			/>
		</Dialog>
	)
}
