import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Unity } from './Unity';
import { Action, Choice } from '../../types';
import { PolicyContext } from '../../hooks/usePolicy';
import { Control } from '../control';
import styled from 'styled-components';
import { FormControlLabel, Switch, SwitchProps, Typography } from '@mui/material';
import { styled as styledSwitch } from '@mui/material/styles';

const Container = styled.div`
	position: sticky;
	top: 20px;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	
	& + & {
		margin-top: -2px;
	}
`;

const Infos = styled.div`
	margin-top: 20px;
`;

const Info = styled.p`
	font-size: 1.4rem;

	& + & {
		margin-top: 5px;
	}
`;

const FormGroup = styled.div`
	margin-top: 20px;
`;

const MySwitch = styledSwitch((props: SwitchProps) => (
	<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
)) (({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		transitionDuration: '300ms',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#558aab',
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#33cf4d',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color:
				theme.palette.mode === 'light'
				? theme.palette.grey[100]
				: theme.palette.grey[600],
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
		boxShadow: 'none',
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
	},
}));

const choices: Record<Choice, string> = {
	'best': 'melhor',
	'random': 'aleatória',
};

export function Map() {
	const [timelimit, setTimeLimit] = useState(250);
	const [active, setActive] = useState(false);
	const [coordinates, setCoordinates] = useState(false);

	const policy = useContext(PolicyContext);
	
	const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>) => {
		if (!/^[0-9]+$/i.test(event.target.value)) {
			setTimeLimit(0);
		}

		setTimeLimit(Number(event.target.value));
	}

	const handleChangeSwitch = (event: ChangeEvent<HTMLInputElement>) => {
		setCoordinates(event.target.checked);
	}

	useEffect(() => {
		if (!active) {
			return;
		}

		const timeout = policy.moveAgent(policy, timelimit);

		return () => clearTimeout(timeout);
	}, [active, policy, timelimit]);

	return <Container>
		<div>
			<Control 
				timelimit={timelimit}
				handleChange={handleChangeLimit}
				buttonActive={active}
				setButtonActive={setActive}
			/>

			{policy.map.map((row: Action[], i) => {
				return <Row key={i}>
					<Unity
						values={row}
						row={i} target={policy.position}
						showCoordinates={coordinates}
					/>
				</Row>;
			})}
		</div>
		<FormGroup>
        	<FormControlLabel sx={{
				marginLeft: 0,
			}}
				control={
					<MySwitch
						checked={coordinates}
						onChange={handleChangeSwitch}
						sx={{ mr: 1 }}
						/>
				}
				label={
					<Typography sx={{
						userSelect: 'none',
						fontFamily: 'inherit',
						fontSize: '1.4rem'
					}}>
						Exibir coordenadas
				  	</Typography>
				}
				/>
		</FormGroup>

		<Infos>
			<Info>Escolha: <b>{choices[policy.choice]}</b></Info>
			<Info>Episódios: <b>{policy.episodes}</b></Info>
			<Info>Convergiu: <b>{policy.converged ? 'Sim' : 'Não'}</b></Info>
		</Infos>
	</Container>;
}
