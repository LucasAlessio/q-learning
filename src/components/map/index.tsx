import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Unity } from './Unity';
import { Action, Choice, Coord } from '../../types';
import { Policy, PolicyContext } from '../../hooks/usePolicy';
import styled from 'styled-components';

const Container = styled.div`
	display: table;
	margin: 0 2px 2px 0;
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

const Input = styled.input`
	display: flex;
	width: 100%;
	height: 40px;
	border: 2px solid #000;
	margin: 0 0px 10px 0;
	padding: 0 10px;
	box-sizing: border-box;
	box-shadow: none;
	outline: none;
	appearance: none;
`;

const choices: Record<Choice, string> = {
	'best': 'melhor',
	'random': 'aleatoria',
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

		const timeout = moveAgent(policy, timelimit);

		return () => clearTimeout(timeout);
	}, [active, policy, timelimit]);

	return <div>
		<Container>
			<Input value={timelimit} onChange={handleChange} />
			<button onClick={_ => setActive(old => !old)}>{active ? 'stop' : 'start'}</button>

			{policy.map.map((row: Action[], i) => {
				return <Row key={i}>
					<Unity
						values={row}
						row={i} target={policy.position}
					/>
				</Row>;
			})}
		</Container>
		escolha: {choices[policy.choice.current]}
	</div>;
}

function moveAgent(policy: Policy, timelimit: number): ReturnType<typeof setTimeout> {
	return setTimeout(() => {
		const position = policy.position.join(':');
		const actions = Object.keys(policy.qTable[position]);
		let action: Coord;

		if (policy.choice.current === 'best') {
			let bestAction: string = "";

			Object.entries(policy.qTable[position]).map(([action, reward]) => {
				if (bestAction.length === 0 && reward > 0) {
					bestAction = action;
				}
				return null;
			});

			if (bestAction.length === 0) {
				action = actions[Math.floor(Math.random() * actions.length)].split(':').map(value => {
					return Number(value);
				}) as Coord;
			} else {
				action = bestAction.split(':').map(value => {
					return Number(value);
				}) as Coord;
			}
		} else {
			action = actions[Math.floor(Math.random() * actions.length)].split(':').map(value => {
				return Number(value);
			}) as Coord;
		}

	
		if (policy.position.join(',') === policy.target.join(',')) {
			policy.choice.current = 'best';
			if (Math.random() >= 0.7) {
				policy.choice.current = 'random';
			}

			policy.setPosition(policy.start);
		}
		else {
			updateQTable(policy, action);
			policy.setPosition(action);
		}
	
	}, timelimit);
}

function updateQTable(policy: Policy, position: Coord) {
	const neighbors = policy.qTable[position.join(':')];
	
	let maxValue = policy.gama  * Math.max(...Object.values(neighbors));
	if (policy.target.join(':') === position.join(':')) {
		maxValue = 100;
	}

	policy.setMap(old => {
		old[policy.position[0]][policy.position[1]] = maxValue * policy.gama;

		return old;
	});

	policy.setQTable(old => {
		old[policy.position.join(':')][position.join(':')] = maxValue;

		return old;
	});
}
