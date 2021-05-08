import React from "react"

export default function Form({onsubmit, buttonText}) {
	const handleSubmit = (event) => {
		event.preventDefault()
		const [username, password] = Array.from(event.target.elements).map(
			({value}) => value
		)
		onsubmit({username, password})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">Username</label>
				<input id="username" />
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input id="password" type="password" />
			</div>
			<div>
				<button type="submit">{buttonText}</button>
			</div>
		</form>
	)
}
