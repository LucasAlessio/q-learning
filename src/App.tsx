import { ReactNode } from "react";
import styled from "styled-components";
import { Map } from "./components/map";
import { Table } from "./components/table";
import { PolicyProvider } from "./hooks/usePolicy";

const Div = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
`;

function Row({children}: {children: ReactNode}) {
	return <Div>
		{children}
	</Div>
}

export function App() {
	return (
		<div className="App">
			<PolicyProvider>
				<Row>
					<Map />
					<Table />
				</Row>
			</PolicyProvider>
		</div>
	);
}
