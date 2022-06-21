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
	episodesWithoutChanges: MutableRefObject<number>,
	start: [number, number],
	target: [number, number],
	gama: number,
}

interface PolicyProviderProps {
	children: ReactNode
}

const gama = 0.9;

const initMap: Action[][] = [
	[  MP.free,  MP.free,  MP.free,  MP.free,  MP.trap, MP.free,  MP.free, MP.free,  MP.free,  MP.free,  MP.free,   MP.trap ],
	[  MP.free,  MP.trap,  MP.free,  MP.free,  MP.free, MP.free,  MP.free, MP.free,  MP.free,  MP.free,  MP.free,   MP.trap ],
	[  MP.trap,  MP.free,  MP.trap,  MP.free,  MP.free, MP.free,  MP.trap, MP.free,  MP.trap,  MP.trap,  MP.free,   MP.free ],
	[  MP.free,  MP.trap,  MP.free,  MP.free,  MP.free, MP.free,  MP.free, MP.free,  MP.trap,  MP.free,  MP.free,   MP.free ],
	[  MP.free,  MP.free,  MP.free,  MP.free,  MP.free, MP.free,  MP.free, MP.free,  MP.free,  MP.free,  MP.free, MP.target ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free,  MP.trap, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free,  MP.free, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free,  MP.free, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
	[ MP.blank, MP.blank, MP.blank, MP.blank,  MP.free, MP.free,  MP.trap, MP.free, MP.blank, MP.blank, MP.blank,  MP.blank ],
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
	const episodesWithoutChanges = useRef(0);

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
		episodesWithoutChanges,
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
			if (![MP.blank].includes(map[i][j])) {
				QTable[i + ':' + j] = typeof QTable[i + ':' + j] == 'undefined' ? {} : QTable[i + ':' + j];

				if (i > 0 && map[i - 1][j] > MP.blank) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[(i - 1) + ':' + j]: 0,
					};
				}
				if (i < map.length - 1 && map[i + 1][j] > MP.blank) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[(i + 1) + ':' + j]: 0,
					};
				}
				if (j > 0 && map[i][j - 1] > MP.blank) {
					QTable[i + ':' + j] = {
						...QTable[i + ':' + j],
						[i + ':' + (j - 1)]: 0,
					};
				}
				if (j < row.length - 1 && map[i][j + 1] > MP.blank) {
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
		const actions = Object.keys(policy.qTable[position]).filter(key => {
			return policy.qTable[policy.position.join(':')][key] >= 0;
		});
		let action: Coord;

		const choice = Math.random() >= (bestChoicePercentage) ? 'random' : 'best';
		
		if (policy.converged === true || choice === 'best') {
			let bestActions: { action: string, reward: number }[] = [];
			
			Object.entries(policy.qTable[position]).map(([action, reward]) => {
				if (reward > 0) {
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
			if (policy.hasChanges.current === false && !tableHasEmptyActions(policy)) {
				if (policy.episodesWithoutChanges.current > 9) {
					policy.setConverged(true);
				} else {
					policy.episodesWithoutChanges.current++;
				}


				console.log(policy.episodesWithoutChanges.current);
			}
			if (policy.converged === false) {
				policy.setEpisodes(episodes => episodes + 1);
			}
			
			policy.setPosition(policy.start);
			policy.hasChanges.current = false;
		} else if (policy.map[policy.position[0]][policy.position[1]] === MP.trap) {
			if (policy.converged === false) {
				policy.setEpisodes(episodes => episodes + 1);
			}

			policy.setPosition(policy.start);
			updateQTable(policy, action);
		} else {
			updateQTable(policy, action);
			policy.setPosition(action);
		}
		
	}, timelimit);
}

function updateQTable(policy: Policy, nextAction: Coord) {
	const neighbors = policy.qTable[nextAction.join(':')];

	let reward = policy.gama * Math.max(...Object.values(neighbors));
	
	if (policy.map[nextAction[0]][nextAction[1]] === MP.target) {
		reward = 100;
	} else if (policy.map[nextAction[0]][nextAction[1]] === MP.trap) {
		reward = MP.trap;
	}

	policy.setMap(map => {
		if (map[policy.position[0]][policy.position[1]] > MP.trap) {
			map[policy.position[0]][policy.position[1]] = Math.max(reward * policy.gama, map[policy.position[0]][policy.position[1]]);
		}

		return map;
	});

	let value = 0;
	policy.setQTable(qTable => {
		if (reward !== MP.trap) {
			value = Math.max(reward, qTable[policy.position.join(':')][nextAction.join(':')]);
		} else {
			value = reward;
		}
		
		if (value !== qTable[policy.position.join(':')][nextAction.join(':')]) {
			qTable[policy.position.join(':')][nextAction.join(':')] = value;
			policy.hasChanges.current = true;
		}

		return qTable;
	});
}

function tableHasEmptyActions(policy: Policy): boolean {
	let response = false;

	Object.entries(policy.qTable).forEach(([position, actions]) => {
		const coords = position.split(":").map(value => {
			return Number(value);
		}) as Coord;

		if (position !== policy.target.join(':') && policy.map[coords[0]][coords[1]] !== MP.trap) {
			Object.entries(actions).forEach(([action, reward]) => {
				const coords = action.split(":").map(value => {
					return Number(value);
				}) as Coord;

				if (policy.map[coords[0]][coords[1]] !== MP.trap && !response && reward === 0) {
					response = true;
				}
			});
		}
	});

	return response;
}
