import { ChangeEvent, useContext, useEffect } from 'react';
import { Unity } from './Unity';
import { Action, ConfigFields } from '../../types';
import { PolicyContext } from '../../hooks/usePolicy';
import { Control } from '../control';
import { SSwitch } from '../form/SSwitch';
import { useForm } from 'react-hook-form';
import { SSlider } from '../form/SSlider';
import styled from 'styled-components';

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
		margin-top: -1px;
	}
`;

const FormGroup = styled.div`
	margin-top: 20px;
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

export function Map() {
	const { register, watch, setValue } = useForm<ConfigFields>({
		defaultValues: {
			timeLimit: 250,
			bestChoicePercentage: 70,
			buttonActive: false,
			showHeatmap: true,
			showCoordinates: false,
		}
	});
	const values = watch();

	const policy = useContext(PolicyContext);

	useEffect(() => {
		if (!values.buttonActive) {
			return;
		}

		const timeout = policy.moveAgent(policy, values.timeLimit, values.bestChoicePercentage);

		return () => clearTimeout(timeout);
	}, [policy, values.buttonActive, values.timeLimit, values.bestChoicePercentage]);

	return <Container>
		<h1>Q-learning</h1>
		<p>Página para a visualização do aprendizado por reforço</p>
		<div>
			<Control
				register={register}
				buttonActive={values.buttonActive}
				setButtonActive={() => setValue('buttonActive', !values.buttonActive)}
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
		</div>
		<FormGroup>
			<SSlider
				label="Porcentagem de melhor escolha"
				defaultValue={70}
				min={0}
				max={100}
				step={10}
				onChange={(event, newValue) => setValue("bestChoicePercentage", newValue as number)}
				valueLabelFormat={(value: number) => `${value}/${100 - value}`}
				/>
		</FormGroup>
		<FormGroup>
			<SSwitch
				label='Exibir mapa de calor'
				checked={values.showHeatmap}
				onChange={(event: ChangeEvent<HTMLInputElement>) => setValue('showHeatmap', event.target.checked)}
				/>
		</FormGroup>
		<FormGroup>
			<SSwitch
				label='Exibir coordenadas'
				checked={values.showCoordinates}
				onChange={(event: ChangeEvent<HTMLInputElement>) => setValue('showCoordinates', event.target.checked)}
				/>
		</FormGroup>
		<Infos>
			<Info>Episódios: <b>{policy.episodes}</b></Info>
			<Info>Convergiu: <b>{policy.converged}</b></Info>
			<Info>Houve alterações: <b>{policy.hasChanges.current ? 'Sim' : 'Não'}</b></Info>
		</Infos>
	</Container>;
}
