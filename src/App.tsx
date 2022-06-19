import { Map } from "./components/map";
import { QTable } from "./components/table";
import { PolicyProvider } from "./hooks/usePolicy";
import { GlobalStyle } from "./styles/GlobalStyle";
import styled from "styled-components";

const Row = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: stretch;
	gap: 20px;
	padding: 20px;

	@media screen and (max-width: 560px) {
		flex-direction: column;
	}
`;

const Column = styled.div`
	width: auto;
	max-width: 430px;

	@media screen and (max-width: 560px) {
		max-width: none;
	}
`

export function App() {
	return <div className="App">
		<GlobalStyle />
		<PolicyProvider>
			<Row>
				<Column>
					<Map />
				</Column>
				<Column>
					<QTable />
				</Column>
			</Row>
		</PolicyProvider>
	</div>
}
