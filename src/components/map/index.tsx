import { ChangeEvent, useContext, useEffect } from 'react';
import { Unity } from './Unity';
import { Action, ConfigFields } from '../../types';
import { PolicyContext, moveAgent } from '../../hooks/usePolicy';
import { Control } from '../control';
import { SSwitch } from '../form/SSwitch';
import { useForm } from 'react-hook-form';
import { SSlider } from '../form/SSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { Presentation } from '../Presentation';
import styled from 'styled-components';

const Container = styled.div`
	position: sticky;
	top: 20px;
	margin-top: 20px;
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	
	& + & {
		margin-top: -1px;
	}
`;

const Content = styled.div`
	& + & {
		margin-top: 20px;
	}
`;

const Info = styled.p`
	font-size: 1.4rem;

	& + & {
		margin-top: 5px;
	}
`;

export function Map() {
	const { register, watch, setValue, formState: { errors } } = useForm<ConfigFields>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		defaultValues: {
			timeLimit: 250,
			bestChoicePercentage: 0.7,
			buttonActive: false,
			showHeatmap: true,
			showCoordinates: false,
		}
	});
	const values = watch();
	const hasErrors = Object.keys(errors).length > 0;
	
	const policy = useContext(PolicyContext);

	useEffect(() => {
		if (!values.buttonActive || hasErrors) {
			return;
		}

		const timeout = moveAgent(policy, values.timeLimit, values.bestChoicePercentage);

		return () => clearTimeout(timeout);
	}, [policy, values.buttonActive, values.timeLimit, values.bestChoicePercentage, hasErrors]);

	return <>
		<Presentation />
		<Container>
			<Content>
				<Control
					register={register}
					buttonActive={values.buttonActive}
					setButtonActive={() => setValue('buttonActive', !values.buttonActive)}
					errors={errors}
				/>

				{policy.map.map((row: Action[], i) => {
					return <Row key={i}>
						<Unity
							values={row}
							row={i} target={policy.position}
							showCoordinates={values.showCoordinates}
							showHeatmap={values.showHeatmap}
							/>
					</Row>;
				})}
			</Content>

			<Content>
				<SSlider
					label="Porcentagem de melhor escolha"
					defaultValue={values.bestChoicePercentage}
					min={0}
					max={1}
					step={0.1}
					disabled={policy.converged}
					onChange={(event, newValue) => setValue("bestChoicePercentage", newValue as number)}
					valueLabelFormat={(value: number) => `${value * 100}/${100 - value * 100}`}
					/>
			</Content>
			
			<Content>
				<SSwitch
					label='Exibir mapa de calor'
					checked={values.showHeatmap}
					onChange={(event: ChangeEvent<HTMLInputElement>) => setValue('showHeatmap', event.target.checked)}
					/>
			</Content>

			<Content>
				<SSwitch
					label='Exibir coordenadas'
					checked={values.showCoordinates}
					onChange={(event: ChangeEvent<HTMLInputElement>) => setValue('showCoordinates', event.target.checked)}
					/>
			</Content>

			<Content>
				<div>
					<Info>Episódios: <b>{policy.episodes}</b></Info>
					<Info>{policy.converged ? <FontAwesomeIcon icon={faCheckSquare} /> : <FontAwesomeIcon icon={faSquare}  /> } Convergiu</Info>
				</div>
			</Content>
		</Container>
	</>;
}
