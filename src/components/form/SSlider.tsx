import { Slider, Typography } from '@mui/material';
import { styled as styledMui } from '@mui/material/styles';
import styled from 'styled-components';

interface SSliderProps {
	label: string,
	value: number,
	min: number,
	max: number,
	step: number,
	disabled?: boolean,
	onChange: (event: Event, newValue: number | number[]) => void,
	valueLabelFormat?: (value: number) => string,
}

const StyledSlider = styledMui(Slider) (({ theme }) => ({
	color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
	height: 2,
	padding: '15px 0',
	'&.MuiSlider-root': {
		boxSizing: 'border-box',
	},
	'.MuiSlider-thumb': {
		height: 22,
		width: 22,
		backgroundColor: '#fff',
		boxShadow: 'none',
		'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
			boxShadow: 'none',
			// Reset on touch devices, it doesn't add specificity
			'@media (hover: none)': {
				boxShadow: 'none',
			},
		},
		'&:before, &:after': {
			content: 'none',
			display: 'none'
		}
	},
	'.MuiSlider-valueLabel': {
		fontSize: '1.2rem',
		backgroundColor: '#83827d',
	},
	'.MuiSlider-track': {
		backgroundColor: '#558aab',
		borderColor: '#558aab',
		height: '5px',
		borderRadius: 0,
	},
	'.MuiSlider-rail': {
		opacity: 0.5,
		backgroundColor: '#558aab',
		border: "1px solid #558aab",
		height: '5px',
		borderRadius: 0,
	},
	'&.Mui-disabled': {
		'.MuiSlider-thumb': {
			'backgroundColor': '#b5b5b5',
		},
		'.MuiSlider-track': {
			borderColor: '#bdbdbd',
			backgroundColor: '#bdbdbd',
		},
		'.MuiSlider-rail': {
			borderColor: '#c1c1c1',
			backgroundColor: '#c1c1c1',
		}
	}
}));

const StyledSliderContainer = styled.div`
	padding: 0 11px;
`;

export function SSlider({label, value, min, max, step, disabled, onChange, valueLabelFormat}: SSliderProps) {
	return <>
		<Typography
			sx={{
				userSelect: 'none',
				fontFamily: 'inherit',
				fontSize: '1.4rem'
			}}
			>
			{label}
		</Typography>
		<StyledSliderContainer>
			<StyledSlider
				key={'teste'}
				aria-label={label}
				value={value}
				valueLabelDisplay="auto"
				step={step}
				min={min}
				max={max}
				disabled={disabled}
				onChange={onChange}
				valueLabelFormat={valueLabelFormat}
				/>
		</StyledSliderContainer>
	</>
}

