import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Unity } from './Unity';
import { ValuePossible } from '../../types';
import { Policy, PolicyContext } from '../../hooks/usePolicy';
import { MapState } from '../../enums/MapState';
import styled from 'styled-components';

const Container = styled.div`
	display: table;
	margin: 0 2px 2px 0;
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
		const pos = policy.position.join(':');
		const options = Object.keys(policy.qTable[pos]);
		const option = options[Math.floor(Math.random() * options.length)].split(':').map(value => {
			return Number(value);
		});
	
		if (policy.position.join(',') === policy.target.join(',')) {
			policy.setPosition(policy.start);
		}
		else {
			if (policy.map[option[0]][option[1]] > 0) {
				const neighbors = Object.keys(policy.qTable[option[0] + ':' + option[1]]);
				
				neighbors.map((neighbor) => {
					const posNeighbor = neighbor.split(':').map(value => {
						return Number(value);
					});

					policy.setMap((old) => {
						if (
							![MapState.block, MapState.border].includes(old[posNeighbor[0]][posNeighbor[1]]) &&
							![MapState.block, MapState.border].includes(policy.map[option[0]][option[1]]) &&
							old[posNeighbor[0]][posNeighbor[1]] < policy.map[option[0]][option[1]] * 0.9
						) {
							policy.map[posNeighbor[0]][posNeighbor[1]] = policy.map[option[0]][option[1]] * 0.9;
						}
						
						return policy.map;
					});

					return null;
				})
			}

			policy.setPosition([option[0], option[1]]);
		}
	
	}, timelimit);
}
