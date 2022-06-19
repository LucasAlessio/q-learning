import { FieldError, UseFormRegister } from "react-hook-form";
import { ConfigFields } from "../../types";
import { SButton } from "../form/SButton";
import { STextField } from "../form/STextField";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import styled from "styled-components";

interface ControlProps {
	register: UseFormRegister<ConfigFields>,
	buttonActive: boolean,
	setButtonActive: () => void,
	errors: Record<string, FieldError | undefined>
}

const Row = styled.div`
	display: flex;
	margin-bottom: 20px;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 20px;
`;

const InputContainer = styled.div`
	flex-grow: 1;
`;

export function Control({register, buttonActive, setButtonActive, errors}: ControlProps) {
	return <Row>
		<InputContainer>
			<STextField
				{...register('timeLimit', { required: true, pattern: /^[0-9]+$/i })}
				label="Milissegundos"
				fullWidth
				icon={<FontAwesomeIcon icon={faStopwatch} />}
				error={!!errors?.timeLimit}
				/>
		</InputContainer>
		<SButton
			variant={buttonActive && !errors?.timeLimit ? 'outlined' : 'contained'}
			onClick={(_) => setButtonActive()}
			disabled={!!errors?.timeLimit}
			>
			{buttonActive && !errors?.timeLimit ? <><FontAwesomeIcon icon={faPause} />&nbsp;pause</> : <><FontAwesomeIcon icon={faPlay} />&nbsp;play</> }
		</SButton>
	</Row>;
}
