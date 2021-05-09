/** @jsxRuntime classic */
/** @jsx jsx */

import Dialog from "@reach/dialog"
import "@reach/dialog/styles.css"
import Form from "./Form"
import {jsx, css} from "@emotion/react"
import {Button, CircleButton} from "./lib"

export default function Modal({isOpen, onDismiss, title, variant, onsubmit}) {
	return (
		<Dialog
			isOpen={isOpen}
			aria-label={`${title === "注册" ? "Registration" : "Login"} form`}
			onDismiss={onDismiss}
			css={css`
				margin: 20vh auto;
				max-width: 450px;
				border-radius: 3px;
				padding-bottom: 3.5em;
				box-shadow: rgb(0 0 0 / 20%) 0px 10px 30px -5px;
			`}
		>
			<div
				css={css`
					display: flex;
					justify-content: flex-end;
				`}
			>
				<CircleButton onClick={onDismiss}>
					<span aria-hidden="true">×</span>
				</CircleButton>
			</div>
			<h3
				css={css`
					text-align: center;
				`}
			>
				{title}
			</h3>
			<Form
				submitButton={<Button variant={variant}>{title}</Button>}
				onsubmit={onsubmit}
			></Form>
		</Dialog>
	)
}
