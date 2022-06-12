import { ReactNode } from "react";
import { Map } from "./components/map";
import { QTable } from "./components/table";
import { PolicyProvider } from "./hooks/usePolicy";
import { GlobalStyle } from "./styles/GlobalStyle";
import styled from "styled-components";

const Div = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: flex-start;
	gap: 20px;
	padding: 20px 0;
`;

function Row({children}: {children: ReactNode}) {
	return <Div>
		{children}
	</Div>
}

export function App() {
	return <div className="App">
		<GlobalStyle />
		<PolicyProvider>
			<Row>
				<Map />
				<QTable />
			</Row>
		</PolicyProvider>
	</div>
}
