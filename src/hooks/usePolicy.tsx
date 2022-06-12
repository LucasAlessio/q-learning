import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { MapState as MP } from "../enums/MapState";
import { Coord, QTable, ValuePossible } from "../types";

export interface Policy {
	map: ValuePossible[][];
	setMap: Dispatch<SetStateAction<ValuePossible[][]>>;
	position: Coord,
	setPosition: Dispatch<SetStateAction<Coord>>,
	qTable: QTable;
	setQTable: Dispatch<SetStateAction<QTable>>;
	start: [number, number],
	target: [number, number],
}

interface PolicyProviderProps {
	children: ReactNode
}

const initMap: ValuePossible[][] = [
	[ MP.normal,  MP.normal,  MP.normal,  MP.normal,   MP.block,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,   MP.block],
	[ MP.normal,   MP.block,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,   MP.block],
	[  MP.block,  MP.normal,   MP.block,  MP.normal,  MP.normal,  MP.normal,   MP.block,  MP.normal,   MP.block,   MP.block,  MP.normal,  MP.normal],
	[ MP.normal,   MP.block,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,   MP.block,  MP.normal,  MP.normal,  MP.normal],
	[ MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.target],
	[ MP.border,  MP.border,  MP.border,  MP.border,  MP.normal,  MP.normal,   MP.block,  MP.normal,  MP.border,  MP.border,  MP.border,  MP.border],
	[ MP.border,  MP.border,  MP.border,  MP.border,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.border,  MP.border,  MP.border,  MP.border],
	[ MP.border,  MP.border,  MP.border,  MP.border,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.border,  MP.border,  MP.border,  MP.border],
	[ MP.border,  MP.border,  MP.border,  MP.border,  MP.normal,  MP.normal,   MP.block,  MP.normal,  MP.border,  MP.border,  MP.border,  MP.border],
	[ MP.border,  MP.border,  MP.border,  MP.border,  MP.normal,  MP.normal,  MP.normal,  MP.normal,  MP.border,  MP.border,  MP.border,  MP.border],
];

const start: Coord = [9, 4];
const target: Coord = [4, 11];

export const PolicyContext = createContext<Policy>({} as Policy);

export const PolicyProvider = ({ children }: PolicyProviderProps) => {
	const [map, setMap] = useState(initMap as ValuePossible[][]);
	const [position, setPosition] = useState(start);
	const [qTable, setQTable] = useState(generateQTable(map));


	return <PolicyContext.Provider value={{	map, setMap, position, setPosition, qTable, setQTable, start, target }}>
		{children}
	</PolicyContext.Provider>
}

export const useTransactions = () => {
	const context = useContext(PolicyContext);

	return context;
}

function generateQTable (map: ValuePossible[][]): QTable {
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
