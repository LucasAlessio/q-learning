import React, { useContext } from "react"
import { PolicyContext } from "../../hooks/usePolicy"
import styled, { css } from "styled-components";

const baseTdStyles = css`
	text-align: center;
	vertical-align: middle;
	border: 1px solid #83827d;
	padding: 5px 15px;
`;

const Table = styled.table`
	border-collapse: collapse;
`;

const Th = styled.th`
	text-align: center;
	font-weight: 600;
	${baseTdStyles}
`;

const Td = styled.td`
	${baseTdStyles}
`;

export function QTable() {
	const {qTable} = useContext(PolicyContext);

	return <Table>
		<thead>
			<tr>
				<Th colSpan={2}>Q()</Th>
				<Th>Recompensa</Th>
			</tr>
		</thead>
		<tbody>
			{Object.entries(qTable).map(([posicao, acoes]: [posicao: string, acoes: Record<string, number>], i) => {
				const neighbors = Object.keys(acoes);
				const values = Object.values(acoes);

				if (neighbors.length === 0) {
					return <tr key={i}>
						<Td>{posicao}</Td>
						<Td>&nbsp;</Td>
						<Td>&nbsp;</Td>
					</tr>
				}

				return <React.Fragment key={i}>
					<tr key={i + '_'}>
						<Td rowSpan={Object.keys(acoes).length}>{posicao}</Td>
						<Td>{neighbors.length ? neighbors[0] : null}</Td>
						<Td>{values.length ? (values[0] / 1 === 0 ? values[0] : values[0].toFixed(4))  : null}</Td>
					</tr>

					{neighbors.length > 1 && Object.entries(acoes).map(([acao, recompensa]: [acao: string, recompensa: number], j) => {
						if (j === 0) {
							return null;
						}

						return <tr key={i + ':' + j}>
							<Td>{acao}</Td>
							<Td>{recompensa % 1 === 0 ? recompensa : recompensa.toFixed(4)}</Td>
						</tr>
					})}
				</React.Fragment>
			})}
		</tbody>
	</Table>
}
