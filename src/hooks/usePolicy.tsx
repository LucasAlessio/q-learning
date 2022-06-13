import { createContext, Dispatch, MutableRefObject, ReactNode, SetStateAction, useContext, useRef, useState } from "react";
import { MapState as MP } from "../enums/MapState";
import { Coord, QTable, Action, Choice } from "../types";

export interface Policy {
	map: Action[][];
	setMap: Dispatch<SetStateAction<Action[][]>>;
	position: Coord,
	setPosition: Dispatch<SetStateAction<Coord>>,
	qTable: QTable;
	setQTable: Dispatch<SetStateAction<QTable>>;
	converged: boolean,
	setConverged: Dispatch<SetStateAction<boolean>>;
	start: [number, number],
	target: [number, number],
	gama: number,
	choice: MutableRefObject<Choice>,
	episodes: MutableRefObject<number>,
	checkConvergence: (policy: Policy, nextAction: string) => boolean,
}

interface PolicyProviderProps {
	children: ReactNode
}

const gama = 0.9;

const initMap: Action[][] = [
	[   MP.free,   MP.free,   MP.free,   MP.free, MP.block, MP.free,  MP.free, MP.free,   MP.free,   MP.free,   MP.free,  MP.block ],
	[   MP.free,  MP.block,   MP.free,   MP.free,  MP.free, MP.free,  MP.free, MP.free,   MP.free,   MP.free,   MP.free,  MP.block ],
	[  MP.block,   MP.free,  MP.block,   MP.free,  MP.free, MP.free, MP.block, MP.free,  MP.block,  MP.block,   MP.free,   MP.free ],
	[   MP.free,  MP.block,   MP.free,   MP.free,  MP.free, MP.free,  MP.free, MP.free,  MP.block,   MP.free,   MP.free,   MP.free ],
	[   MP.free,   MP.free,   MP.free,   MP.free,  MP.free, MP.free,  MP.free, MP.free,   MP.free,   MP.free,   MP.free, MP.target ],
	[ MP.border, MP.border, MP.border, MP.border,  MP.free, MP.free, MP.block, MP.free, MP.border, MP.border, MP.border, MP.border ],
	[ MP.border, MP.border, MP.border, MP.border,  MP.free, MP.free,  MP.free, MP.free, MP.border, MP.border, MP.border, MP.border ],
	[ MP.border, MP.border, MP.border, MP.border,  MP.free, MP.free,  MP.free, MP.free, MP.border, MP.border, MP.border, MP.border ],
	[ MP.border, MP.border, MP.border, MP.border,  MP.free, MP.free, MP.block, MP.free, MP.border, MP.border, MP.border, MP.border ],
	[ MP.border, MP.border, MP.border, MP.border,  MP.free, MP.free,  MP.free, MP.free, MP.border, MP.border, MP.border, MP.border ],
];

const start: Coord = [9, 4];
const target: Coord = [4, 11];

export const PolicyContext = createContext<Policy>({} as Policy);

export const PolicyProvider = ({ children }: PolicyProviderProps) => {
	const [map, setMap] = useState(initMap as Action[][]);
	const [position, setPosition] = useState(start);
	const [qTable, setQTable] = useState(generateQTable(map));
	const [converged, setConverged] = useState(false);
	const choice = useRef<Choice>('random');
	const episodes = useRef(0);


	return <PolicyContext.Provider value={{
		map,
		setMap,
		position,
		setPosition,
		qTable,
		setQTable,
		converged,
		setConverged,
		start,
		target,
		gama,
		choice,
		episodes,
		checkConvergence
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
			if (![MP.block, MP.border].includes(map[i][j])) {
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

function checkConvergence(policy: Policy, nextAction: string) {
	return false;
}
