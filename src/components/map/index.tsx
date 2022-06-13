import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Unity } from './Unity';
import { Action, Choice } from '../../types';
import { PolicyContext } from '../../hooks/usePolicy';
import { Control } from '../control';
import styled from 'styled-components';

const Container = styled.div`
	position: sticky;
	top: 20px;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	
	& + & {
		margin-top: -2px;
	}
`;

const Info = styled.p`
	font-size: 1.4rem;
	margin-top: 20px;
`;

const choices: Record<Choice, string> = {
	'best': 'melhor',
	'random': 'aleatória',
};

export function Map() {
	const [timelimit, setTimeLimit] = useState(250);
	const [active, setActive] = useState(false);

	const policy = useContext(PolicyContext);
	
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTimeLimit(Number(event.target.value));
	}

	useEffect(() => {
		if (!active || policy.converged) {
			return;
		}

		const timeout = policy.moveAgent(policy, timelimit);

		return () => clearTimeout(timeout);
	}, [active, policy, timelimit]);

	return <Container>
		<div>
			<Control 
				timelimit={timelimit}
				handleChange={handleChange}
				buttonActive={active}
				setButtonActive={setActive}
			/>

			{policy.map.map((row: Action[], i) => {
				return <Row key={i}>
					<Unity
						values={row}
						row={i} target={policy.position}
					/>
				</Row>;
			})}
		</div>
		<Info>
			Escolha: <b>{choices[policy.choice]}</b>
		</Info>
	</Container>;
}
