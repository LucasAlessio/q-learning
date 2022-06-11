import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Unity } from './Unity';

export type ValuePossible = 100 | -100 | 1 | 'xx' | number;
export type Coord = [number, number];

type QTable = Record<string, Record<string, {recompensa: number}>>;

export const isNumber = (value: any): boolean => {
	return typeof value === 'number' && isFinite(value);
}

const initMap: ValuePossible[][] = [
	[   0,    0,    0,    0, -100,    0,    0,    0,    0,    0,    0, -100],
	[   0, -100,    0,    0,    0,    0,    0,    0,    0,    0,    0, -100],
	[-100,    0, -100,    0,    0,    0, -100,    0, -100, -100,    0,    0],
	[   0, -100,    0,    0,    0,    0,    0,    0, -100,    0,    0,    0],
	[   0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,  100],
	['xx', 'xx', 'xx', 'xx',    0,    0, -100,    0, 'xx', 'xx', 'xx', 'xx'],
	['xx', 'xx', 'xx', 'xx',    0,    0,    0,    0, 'xx', 'xx', 'xx', 'xx'],
	['xx', 'xx', 'xx', 'xx',    0,    0,    0,    0, 'xx', 'xx', 'xx', 'xx'],
	['xx', 'xx', 'xx', 'xx',    0,    0, -100,    0, 'xx', 'xx', 'xx', 'xx'],
	['xx', 'xx', 'xx', 'xx',    0,    0,    0,    0, 'xx', 'xx', 'xx', 'xx'],
];

const start: Coord = [9, 4];
const target: Coord = [4, 11];

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
	const [map, setMap] = useState(initMap as ValuePossible[][]);
	const qTable: QTable = useMemo(() => generateQTable(map), [map]);
	
	const [timelimit, setTimeLimit] = useState(1000);
	const [position, setPosition] = useState(start);


	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTimeLimit(Number(event.target.value));
	}

	useEffect(() => {
		const timeout = updateQTable(map, qTable, position, setPosition, setMap, timelimit);

		return () => clearTimeout(timeout);
	}, [map, qTable, position, timelimit]);

	return <Container>
		<Input value={timelimit} onChange={handleChange} />
		{map.map((row: ValuePossible[], i) => {
			return <Row key={i}>
				<Unity
					values={row}
					row={i} target={position}
				/>
			</Row>;
		})}
	</Container>;
}

function generateQTable (map: ValuePossible[][]): QTable {
	const QTable: QTable = {};

	map.map((row, i) => {
		row.map((_, j) => {
			if (!['xx', -100].includes(map[i][j])) {
				QTable[i + ':' + j] = typeof QTable[i + ':' + j] == 'undefined' ? {} : QTable[i + ':' + j];

				if (i > 0 && isNumber(map[i - 1][j]) && map[i - 1][j] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[(i - 1) + ':' + j]: {
							recompensa: 0,
						}
					};
				}
				if (i < map.length - 1 && isNumber(map[i + 1][j]) && map[i + 1][j] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[(i + 1) + ':' + j]: {
							recompensa: 0,
						}
					};
				}
				if (j > 0 && isNumber(map[i][j - 1]) && map[i][j - 1] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[i + ':' + (j - 1)]: {
							recompensa: 0,
						}
					};
				}
				if (j < row.length - 1 && isNumber(map[i][j + 1]) && map[i][j + 1] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[i + ':' + (j + 1)]: {
							recompensa: 0,
						}
					};
				}
			}
			return null;
		});
		return null;
	});
	return QTable;
};

const updateQTable = (
	map: ValuePossible[][],
	qTable: QTable,
	position: Coord,
	setPosition: Dispatch<SetStateAction<Coord>>,
	setMap: Dispatch<SetStateAction<ValuePossible[][]>>,
	timelimit: number
) => {
	return setTimeout(() => {
		const pos = position.join(':');
		const options = Object.keys(qTable[pos]);
		const option = options[Math.floor(Math.random() * options.length)].split(':');
	
		if (position.join(',') === target.join(',')) {
			setPosition(start);
		}
		else {
			if (isNumber(map[Number(option[0])][Number(option[1])]) && map[Number(option[0])][Number(option[1])] > 0) {
				const neighbors = Object.keys(qTable[Number(option[0]) + ':' + Number(option[1])]);
				
				neighbors.map((neighbor) => {
					const posNeighbor = neighbor.split(':');

					setMap((old) => {
						if (isNumber(old[Number(posNeighbor[0])][Number(posNeighbor[1])]) &&
							isNumber(map[Number(option[0])][Number(option[1])]) &&
							old[Number(posNeighbor[0])][Number(posNeighbor[1])] < Number(map[Number(option[0])][Number(option[1])]) * 0.9
						) {
							map[Number(posNeighbor[0])][Number(posNeighbor[1])] = Number(map[Number(option[0])][Number(option[1])]) * 0.9;
						}
						
						return map;
					});

					return null;
				})
			}

			setPosition([Number(option[0]), Number(option[1])]);
		}
	
	}, timelimit);
}
