import styled, { css } from 'styled-components';
import { Coord, isNumber, ValuePossible } from ".";

function hexToRgb(hex: string): Record<'r' | 'g' | 'b', number> {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : {
		r: 0,
		g: 0,
		b: 0
	};
}

const Div = styled.div`
	display: block;
	width: 35px;
	height: 35px;
	border: 2px solid #a79259;
	margin-right: -2px;

	${({dataType, dataActive}: {dataType: ValuePossible, dataActive: boolean}) => isNumber(dataType) && dataType > 0 && !dataActive && css`
		background: rgba(
			${hexToRgb("#59824b").r},
			${hexToRgb("#59824b").g},
			${hexToRgb("#59824b").b},
			${Number(dataType) / 100}
		);
	`}

	${({dataType, dataActive}: {dataType: ValuePossible, dataActive: boolean}) => dataType === -100 && !dataActive && css`
		background: #000;
	`}

	${({dataType, dataActive}: {dataType: ValuePossible, dataActive: boolean}) => dataType === 'xx' && !dataActive && css`
		border-color: transparent;
	`}

	${({dataType, dataActive}: {dataType: ValuePossible, dataActive: boolean}) => dataActive && css`
		background: #b35a58;
	`}
`;

export function Unity({values, row, target}: {values: ValuePossible[], row: number, target: Coord}) {
	return <>
		{values.map((value, j) => {
			return <Div
						dataType={value}
						dataActive={[target].join(",") === [row, j].join(',')}
						key={j}
					/>
		})}
	</>
}
