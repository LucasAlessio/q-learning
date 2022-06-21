import styled, { css } from 'styled-components';
import { MapState as MP } from '../../enums/MapState';
import { Coord, Action } from '../../types';
import { hex2rgb } from '../../utils/hex2rgb';

interface UnityProps {
	values: Action[],
	row: number,
	target: Coord,
	showHeatmap: boolean,
	showCoordinates: boolean,
}

const Div = styled.div`
	position: relative;
	flex-grow: 1;
	display: block;
	border: 1px solid #a79259;

	&:after {
		content: " ";
		display: block;
		width: 100%;
		height: 0;
		padding-top: 100%;
	}

	span {
		font-size: 1rem;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	& + & {
		margin-left: -1px;
	}

	${({dataType, dataActive, dataShowheatmap}: {
		dataType: Action,
		dataActive: boolean,
		dataShowheatmap: boolean
	}) => dataType > 1 && !dataActive && ((!dataShowheatmap && dataType === MP.target) || dataShowheatmap === true) && css`
		background: rgba(
			${ hex2rgb("#59824b").r },
			${ hex2rgb("#59824b").g },
			${ hex2rgb("#59824b").b },
			${ Number(dataType) / 100 }
		);
	`}

	${({dataType, dataActive}: {dataType: Action, dataActive: boolean}) => dataType === MP.trap && !dataActive && css`
		color: #fff;
		background: #000;
	`}

	${({dataType, dataActive}: {dataType: Action, dataActive: boolean}) => dataType === MP.blank && !dataActive && css`
		border-color: transparent;
	`}

	${({dataActive}: {dataActive: boolean}) => dataActive && css`
		background: #b35a58;
	`}
`;

export function Unity({values, row, target, showHeatmap, showCoordinates}: UnityProps) {
	return <>
		{values.map((value, column) => {
			return <Div
				dataType={value}
				dataActive={[target].join(",") === [row, column].join(',')}
				dataShowheatmap={showHeatmap}
				key={column}
				>
				{ showCoordinates ? value !== MP.blank ? <span>{row}:{column}</span> : <></> : <></> }
			</Div>
		})}
	</>
}
