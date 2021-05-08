import React from "react"
import { Dialog } from "@reach/dialog"
import "@reach/dialog/styles.css"

export default function Modal({ isOpen, onDismiss, title }) {
	return (
		<Dialog isOpen={isOpen} onDismiss={onDismiss}>
			<h3>{title}</h3>
			<button onClick={onDismiss}>Okay</button>
		</Dialog>
	)
}
