import React, { useContext } from "react"
import { PolicyContext } from "../../hooks/usePolicy"

export function Table() {
	const {qTable} = useContext(PolicyContext);

	return <table border={1}>
		<thead>
			<tr>
				<th colSpan={2}>Q()</th>
				<th>Recompensa</th>
			</tr>
		</thead>
		<tbody>
			{Object.entries(qTable).map(([posicao, acoes]: [posicao: string, acoes: Record<string, {recompensa: number}>], i) => {
				const neighbors = Object.keys(acoes);
				const values = Object.values(acoes);

				if (neighbors.length === 0) {
					return <tr key={i}>
						<td>{posicao}</td>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
					</tr>
				}

				return <React.Fragment key={i}>
					<tr key={i + '_'}>
						<td rowSpan={Object.keys(acoes).length}>{posicao}</td>
						<td>{neighbors.length ? neighbors[0] : null}</td>
						<td>{values.length ? values[0].recompensa : null}</td>
					</tr>

					{neighbors.length > 1 && Object.entries(acoes).map(([acao, recompensa]: [acao: string, recompensa: Record<'recompensa', number>], j) => {
						if (j === 0) {
							return null;
						}

						return <tr key={i + ':' + j}>
							<td>{acao}</td>
							<td>{recompensa.recompensa}</td>
						</tr>
					})}
				</React.Fragment>
			})}
		</tbody>
	</table>
}
