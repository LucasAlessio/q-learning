export type Action = number;
export type Coord = [number, number];
export type QTable = Record<string, Record<string, number>>;
export type Choice = 'random' | 'best';
