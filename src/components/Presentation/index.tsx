import styled from "styled-components"

const Heading = styled.h1`
	font-size: 2.8rem;
	margin-bottom: 10px;
`;
const P = styled.p`
	font-size: 1.4rem;
	white-space: pre-wrap;

	& + & {
		margin-top: 10px;
	}
`;

export function Presentation() {
	return <>
		<Heading>Q-learning</Heading>

		<P>Página destinada à visualização da execução do algoritmo de aprendizado por reforço Q-learning.</P>
	</>
}
