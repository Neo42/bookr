import styled from "@emotion/styled"
import {Dialog as ReachDialog} from "@reach/dialog"
import {black, primary, secondary, white} from "../tokens/colors"

const buttonVariants = {
	primary: {
		background: primary,
		color: black
	},
	secondary: {
		background: secondary,
		color: white
	}
}

const Button = styled.button(
	{
		padding: `10px 20px`,
		lineHeight: 1,
		border: "none",
		borderRadius: 5
	},
	({variant = "primary"}) => buttonVariants[variant]
)

const CircleButton = styled.button`
	border-radius: 30px;
	padding: 0px;
	width: 40px;
	height: 40px;
	line-height: 1;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	background: white;
	color: ${black};
	border: 1px solid rgb(241, 241, 244);
	cursor: pointer;
`

const Input = styled.input`
	border-radius: 3px;
	border: 1px solid rgb(241, 241, 244);
	background: rgb(241, 242, 247);
	padding: 8px 12px;
`

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
`

const Dialog = styled(ReachDialog)({})

export {Button, CircleButton, Dialog, FormGroup, Input}
