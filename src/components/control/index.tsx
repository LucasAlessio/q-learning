import { ChangeEvent, Dispatch, SetStateAction } from "react";
import styled, { css } from "styled-components";

interface ControlProps {
	timelimit: number,
	handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
	buttonActive: boolean,
	setButtonActive: Dispatch<SetStateAction<boolean>>,
}

const formElement = css`
	box-sizing: border-box;
	box-shadow: none;
	outline: none;
	border-radius: 0;
	appearance: none;
`;

const Row = styled.div`
	display: flex;
	margin-bottom: 20px;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 20px;
`;

const Input = styled.input`
font-size: 1.4rem;
	display: flex;
	width: 100%;
	height: 40px;
	padding: 0 10px;
	border: 2px solid #000;
	flex-grow: 1;
	${formElement}
`;

const Button = styled.button`
font-size: 1.2rem;
	color: #fff;
	text-align: center;
	min-width: 75px;
	height: 40px;
	padding: 0 15px;
	background-color: #59824b;
	border: 0;
	cursor: pointer;
	${formElement}

	${({dataRunning}: {dataRunning: boolean}) => dataRunning && css`
		background: #b35a58;

		&:hover {
			background-color: #a44a48;
		}
		&:active {
			background-color: #953c3a;
		}
	`}

	${({dataRunning}: {dataRunning: boolean}) => !dataRunning && css`
		&:hover {
			background-color: #507942;
		}
		&:active {
			background-color: #426437;
		}
	`}
`;

export function Control({timelimit, handleChange, buttonActive, setButtonActive}: ControlProps) {
	return <Row>
		<Input value={timelimit} onChange={handleChange} />
		<Button onClick={_ => setButtonActive(old => !old)} dataRunning={buttonActive}>
			{buttonActive ? 'pause' : 'start'}
		</Button>
	</Row>;
}
