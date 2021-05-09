/** @jsxRuntime classic */
/** @jsx jsx */

import {jsx} from "@emotion/react"
import {FormGroup, Input} from "./lib"

import React from "react"

export default function LoginForm({onsubmit, submitButton}) {
	const handleSubmit = (event) => {
		event.preventDefault()
		const [username, password] = Array.from(event.target.elements).map(
			({value}) => value
		)
		onsubmit({username, password})
	}

	return (
		<form
			css={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				"> div": {
					margin: "10px auto",
					width: "100%",
					maxWidth: "300px"
				}
			}}
			onSubmit={handleSubmit}
		>
			<FormGroup>
				<label htmlFor="username">用户名</label>
				<Input id="username" />
			</FormGroup>
			<FormGroup>
				<label htmlFor="password">密码</label>
				<Input id="password" type="password" />
			</FormGroup>
			<div>{React.cloneElement(submitButton, {type: "submit"})}</div>
		</form>
	)
}
