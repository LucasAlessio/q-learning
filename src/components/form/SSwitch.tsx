import { ChangeEvent } from 'react';
import { FormControlLabel, Switch, SwitchProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface SSwitchProps {
	label: string,
	checked: boolean,
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const StyledSwitch = styled((props: SwitchProps) => (
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

export function SSwitch({label, checked, onChange}: SSwitchProps) {
	return <FormControlLabel sx={{
		marginLeft: 0,
	}}
		control={
			<StyledSwitch
				checked={checked}
				onChange={onChange}
				sx={{ mr: 1 }}
				/>
		}
		label={
			<Typography sx={{
				userSelect: 'none',
				fontFamily: 'inherit',
				fontSize: '1.4rem'
			}}>
				{label}
			</Typography>
		}
		/>
}
