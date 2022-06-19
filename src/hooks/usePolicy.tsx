import { createContext, Dispatch, MutableRefObject, ReactNode, SetStateAction, useContext, useRef, useState } from "react";
import { MapState as MP } from "../enums/MapState";
import { Coord, QTable, Action } from "../types";

interface Policy {
	map: Action[][];
	setMap: Dispatch<SetStateAction<Action[][]>>;
	position: Coord,
	setPosition: Dispatch<SetStateAction<Coord>>,
	qTable: QTable;
	setQTable: Dispatch<SetStateAction<QTable>>;
	converged: boolean,
	setConverged: Dispatch<SetStateAction<boolean>>;
	episodes: number,
	setEpisodes: Dispatch<SetStateAction<number>>,
	hasChanges: MutableRefObject<boolean>,
	start: [number, number],
	target: [number, number],
	gama: number,
}

interface PolicyProviderProps {
	children: ReactNode
}

const gama = 0.9;

const initMap: Action[][] = [
	[  MP.free,  MP.free,  MP.free,  MP.free, MP.block, MP.free,  MP.free, MP.free,  MP.free,  MP.free,  MP.free,  MP.block ],
	[  MP.free, MP.block,  MP.free,  MP.free,  MP.free, MP.free,  MP.free, MP.free,  MP.free,  MP.free,  MP.free,  MP.block ],
	[ MP.block,  MP.free, MP.block,  MP.free,  MP.free, MP.free, MP.block, MP.free, MP.block, MP.block,  MP.free,   MP.free ],
	[  MP.free, MP.block,  MP.free,  MP.free,  MP.free, MP.free,  MP.free, MP.free, MP.block,  MP.free,  MP.free,   MP.free ],
	[  MP.free,  MP.free,  MP.free,  MP.free,  MP.free, MP.free,  MP.free, MP.free,  MP.free,  MP.free,  MP.free, MP.target ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free, MP.block, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free,  MP.free, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free,  MP.free, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free, MP.block, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free,  MP.free, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
];

const start: Coord = [9, 4];
const target: Coord = [4, 11];

export const PolicyContext = createContext<Policy>({} as Policy);

export const PolicyProvider = ({ children }: PolicyProviderProps) => {
	const [map, setMap] = useState(initMap as Action[][]);
	const [position, setPosition] = useState(start);
	const [qTable, setQTable] = useState(generateQTable(map));
	const [converged, setConverged] = useState(false);
	const [episodes, setEpisodes] = useState(0);
	const hasChanges = useRef(false);

	return <PolicyContext.Provider value={{
		map,
		setMap,
		position,
		setPosition,
		qTable,
		setQTable,
		converged,
		setConverged,
		episodes,
		setEpisodes,
		hasChanges,
		start,
		target,
		gama
	}}>
		{children}
	</PolicyContext.Provider>
}

export const useTransactions = () => {
	const context = useContext(PolicyContext);

	return context;
}

function generateQTable (map: Action[][]): QTable {
	const QTable: QTable = {};

	map.map((row, i) => {
		row.map((_, j) => {
			if (![MP.block,  MP.blank].includes(map[i][j])) {
				QTable[i + ':' + j] = typeof QTable[i + ':' + j] == 'undefined' ? {} : QTable[i + ':' + j];

				if (i > 0 && map[i - 1][j] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[(i - 1) + ':' + j]: 0,
					};
				}
				if (i < map.length - 1 && map[i + 1][j] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[(i + 1) + ':' + j]: 0,
					};
				}
				if (j > 0 && map[i][j - 1] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[i + ':' + (j - 1)]: 0,
					};
				}
				if (j < row.length - 1 && map[i][j + 1] >= 0) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[i + ':' + (j + 1)]: 0,
					};
				}
			}
			return null;
		});
		return null;
	});
	return QTable;
};

export function moveAgent(policy: Policy, timelimit: number, bestChoicePercentage: number): ReturnType<typeof setTimeout> {
	return setTimeout(() => {
		const position = policy.position.join(':');
		const actions = Object.keys(policy.qTable[position]);
		let action: Coord;

		const choice = Math.random() >= (bestChoicePercentage) ? 'random' : 'best';
		
		if (policy.converged === true || choice === 'best') {
			let bestActions: { action: string, reward: number }[] = [];
			
			Object.entries(policy.qTable[position]).map(([action, reward]) => {
				if (reward !== 0) {
					if (bestActions.length === 0) {
						bestActions.push({
							action: action,
							reward: reward,
						});
					} else if (reward > bestActions[0].reward) {
						bestActions = [{
							action: action,
							reward: reward,
						}];
					} else if (reward === bestActions[0].reward) {
						bestActions.push({
							action: action,
							reward: reward,
						});
					}
				}
				return null;
			});
			
			if (bestActions.length === 0) {
				action = actions[Math.floor(Math.random() * actions.length)].split(':').map(value => {
					return Number(value);
				}) as Coord;
			} else {
				action = bestActions[Math.floor(Math.random() * bestActions.length)].action.split(':').map(value => {
					return Number(value);
				}) as Coord;
			}
		} else {
			action = actions[Math.floor(Math.random() * actions.length)].split(':').map(value => {
				return Number(value);
			}) as Coord;
		}
		
		
		if (policy.position.join(',') === policy.target.join(',')) {
			if (policy.hasChanges.current === false) {
				policy.setConverged(true);
			}
			if (policy.converged === false) {
				policy.setEpisodes(episodes => episodes + 1);
			}
			
			policy.setPosition(policy.start);
			policy.hasChanges.current = false;
		}
		else {
			updateQTable(policy, action);
			policy.setPosition(action);
		}
		
	}, timelimit);
}

function updateQTable(policy: Policy, nextAction: Coord) {
	const neighbors = policy.qTable[nextAction.join(':')];
	
	let maxValue = policy.gama * Math.max(...Object.values(neighbors));
	let value = 0;
	
	if (policy.target.join(':') === nextAction.join(':')) {
		maxValue = 100;
	}

	policy.setMap(map => {
		map[policy.position[0]][policy.position[1]] = Math.max(maxValue * policy.gama, map[policy.position[0]][policy.position[1]]);
		return map;
	});

	policy.setQTable(qTable => {
		value = Math.max(maxValue, qTable[policy.position.join(':')][nextAction.join(':')]);
		
		if (value !== qTable[policy.position.join(':')][nextAction.join(':')]) {
			qTable[policy.position.join(':')][nextAction.join(':')] = value;
			policy.hasChanges.current = true;
		}

		return qTable;
	});
}
