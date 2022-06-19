import { MouseEvent, ReactNode } from "react";
import { Button, ButtonTypeMap } from "@mui/material";
import { styled } from "@mui/system";

interface SButtonProps {
	variant: ButtonTypeMap['props']["variant"],
	onClick: (event: MouseEvent<HTMLElement>) => void,
	disabled?: boolean,
	children: ReactNode,
}

const StyledButton = styled(Button) (({ variant }) => ({
	fontFamily: 'inherit',
	fontSize: '1.4rem',
	fontWeight: '400',
	lineHeight: variant === 'contained' ? '40px' : '38px',
	color: variant === 'contained' ? '#fff' : '#558aab',
	borderRadius: 0,
	padding: '0 18px',
	height: '40px',
	minWidth: '95px',
	borderColor: '#558aab',
	backgroundColor: variant === 'contained' ? '#558aab' : 'initial',
	'&:hover': {
		color: variant === 'contained' ? '#fff' : '#4b7b99',
		backgroundColor: variant === 'contained' ? '#4b7b99' : 'initial',
		borderColor: '#4b7b99',
		boxShadow: 'none',
	},
}));

export function SButton({variant, onClick, disabled, children}: SButtonProps) {
	return <StyledButton variant={variant} onClick={onClick} disabled={disabled}>
		{children}
	</StyledButton>;
}
