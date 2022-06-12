import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Unity } from './Unity';
import { ValuePossible } from '../../types';
import { Policy, PolicyContext } from '../../hooks/usePolicy';
import { Coord } from './ValuePossible';
import styled from 'styled-components';

const GAMA = 0.9;

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
	margin-bottom: -2px;
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

export function Map() {
	const [timelimit, setTimeLimit] = useState(250);
	const [active, setActive] = useState(false);

	const policy = useContext(PolicyContext);
	
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTimeLimit(Number(event.target.value));
	}

	useEffect(() => {
		if (!active) {
			return;
		}

		const timeout = updateMap(policy, timelimit);

		return () => clearTimeout(timeout);
	}, [active, policy, timelimit]);

	return <Container>
		<Input value={timelimit} onChange={handleChange} />
		<button onClick={_ => setActive(old => !old)}>{active ? 'stop' : 'start'}</button>

		{policy.map.map((row: ValuePossible[], i) => {
			return <Row key={i}>
				<Unity
					values={row}
					row={i} target={policy.position}
				/>
			</Row>;
		})}
	</Container>;
}

function updateMap(policy: Policy, timelimit: number): ReturnType<typeof setTimeout> {
	return setTimeout(() => {
		const position = policy.position.join(':');
		let action: Coord;

		let bestAction: string = "";
		Object.entries(policy.qTable[position]).map(([action, reward]) => {
			if (bestAction.length === 0 && reward > 0) {
				bestAction = action;
			}
		});

		if (bestAction.length === 0) {
			const actions = Object.keys(policy.qTable[position]);
			action = actions[Math.floor(Math.random() * actions.length)].split(':').map(value => {
			 	return Number(value);
			}) as Coord;
		} else {
			action = bestAction.split(':').map(value => {
				return Number(value);
		   }) as Coord;
		}

	
		if (policy.position.join(',') === policy.target.join(',')) {
			policy.setPosition(policy.start);
		}
		else {
			// if (policy.map[action[0]][action[1]] > 0) {
			// 	const neighbors = Object.keys(policy.qTable[action[0] + ':' + action[1]]);
				
			// 	neighbors.map((neighbor) => {
			// 		const posNeighbor = neighbor.split(':').map(value => {
			// 			return Number(value);
			// 		});

			// 		policy.setMap((old) => {
			// 			if (
			// 				![MapState.block, MapState.border].includes(old[posNeighbor[0]][posNeighbor[1]]) &&
			// 				![MapState.block, MapState.border].includes(policy.map[action[0]][action[1]]) &&
			// 				old[posNeighbor[0]][posNeighbor[1]] < policy.map[action[0]][action[1]] * 0.9
			// 			) {
			// 				policy.map[posNeighbor[0]][posNeighbor[1]] = policy.map[action[0]][action[1]] * 0.9;
			// 			}
						
			// 			return policy.map;
			// 		});

			// 		return null;
			// 	})
			// }
			updateQTable(policy, action);

			policy.setPosition(action);
		}
	
	}, timelimit);
}

function updateQTable(policy: Policy, position: Coord) {
	const neighbors = policy.qTable[position.join(':')];
	
	let maxValue = GAMA  * Math.max(...Object.values(neighbors));
	if (policy.target.join(':') === position.join(':')) {
		maxValue = 100;
	}

	policy.setQTable(old => {
		old[policy.position.join(':')][position.join(':')] = maxValue;

		return old;
	});
}
