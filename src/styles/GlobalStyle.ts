import { createGlobalStyle } from 'styled-components';
 
export const GlobalStyle = createGlobalStyle`
	* {
		font-family: 'Poppins', sans-serif;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html {
		font-size: 10px;
	}

	body {
		background: #dedfd9;
	}
`;
