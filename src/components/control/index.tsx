import { UseFormRegister } from "react-hook-form";
import { ConfigFields } from "../../types";
import { SButton } from "../form/SButton";
import { STextField } from "../form/STextField";
import styled from "styled-components";

interface ControlProps {
	register: UseFormRegister<ConfigFields>,
	buttonActive: boolean,
	setButtonActive: () => void,
}

const Row = styled.div`
	display: flex;
	margin-bottom: 20px;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 20px;
`;

export function Control({register, buttonActive, setButtonActive}: ControlProps) {
	return <Row>
		<STextField
			{...register('timeLimit', { pattern: /^[0-9]+$/i })}
			label="Milissegundos"
			fullWidth
			/>
		<SButton
			variant={ buttonActive ? 'outlined' : 'contained' }
			onClick={(event) => setButtonActive()}
			>
			{ buttonActive ? 'pause' : 'start' }
		</SButton>
	</Row>;
}
