import { forwardRef, ReactNode } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { styled } from "@mui/system";

interface STextFieldProps {
	label: string,
	fullWidth?: boolean,
	icon?: ReactNode,
	error?: boolean
}

const StyledTextField = styled(TextField) (({ theme }) => ({
	'label': {
		fontFamily: 'inherit',
		fontSize: '1.4rem',
		color: '#83827d',
		transform: 'translate(14px, 10px) scale(1)',
	},
	'label.MuiInputLabel-shrink': {
		marginTop: '2px',
		transform: 'translate(14px,-9px) scale(0.75)',
	},
	'label.Mui-focused': {
		color: '#558aab',
		marginTop: '2px',

		'&.Mui-error': {
			color: '#d32f2f',
		}
	},
	'.MuiOutlinedInput-root': {
		fontSize: '1.4rem',
		fontFamily: 'inherit',

		'.MuiOutlinedInput-input': {
			height: '40px',
			padding: '0 14px',
		},
		'fieldset': {
			borderRadius: 0,
			borderColor: '#83827d',
			transition: 'none',
		},
		'&.Mui-focused fieldset': {
			borderColor: '#558aab',

		},
		'&.Mui-error.Mui-focused fieldset': {
			'borderColor': "#d32f2f",
		}
	},
	'.MuiInputAdornment-root': {
		marginRight: '0px',
	},
	'.Mui-focused .MuiInputAdornment-root': {
		color: '#558aab',
	},
	'.Mui-error .MuiInputAdornment-root': {
		color: '#d32f2f',
	}
}));

export const STextField = forwardRef<HTMLInputElement, STextFieldProps>(({ label, fullWidth, icon, error, ...props }: STextFieldProps, ref) => {
	return <StyledTextField
			ref={ref} {...props}
			label={label}
			fullWidth={fullWidth}
			error={error}
			InputProps={(icon && {
				startAdornment: (
					<InputAdornment position="start">
						{icon}
					</InputAdornment>
				),
			}) || {}}
			/>
});
