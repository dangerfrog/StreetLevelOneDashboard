import { BaseModal, FormControl } from '@hexhive/ui';
import { Box, Calendar, Text, DateInput } from 'grommet';
import React, { useEffect, useState } from 'react';

export const ScheduleCampaignModal = (props) => {
	const [ schedule, setSchedule ] = useState<any>();

	useEffect(() => {
		setSchedule({
			...props.selected,
			campaign: props.selected?.campaign?.id,
			tier: props.selected?.tier?.id,
		})
		// console.log({selected: props.selected})
	}, [props.selected])

	const onSubmit = () => {
		props.onSubmit(schedule);
	}

	return (
		<BaseModal 
			title="Assign Campaign"
			onClose={props.onClose}
			onDelete={props.onDelete}
			onSubmit={onSubmit}
			open={props.open}>
			<FormControl 
				onChange={(value) => setSchedule({...schedule, campaign: value})}
				value={schedule?.campaign}
				options={props.campaigns}
				placeholder="Campaign" />
			<FormControl 
				onChange={(value) => setSchedule({...schedule, tier: value})}
				value={schedule?.tier}
				options={props.tiers} 
				placeholder="Tier" />
			
			<Text size="small">Scheduled Dates</Text>
			<Box margin={{top: 'small'}} align="center" direction='row'>
				<DateInput
					value={schedule?.dates || [new Date().toISOString(), new Date().toISOString()]}
					calendarProps={{range: true, size: 'small'}} 
					format='dd/mm/yyyy - dd/mm/yyyy'
					onChange={({value}) => setSchedule({...schedule, dates: value})}
					placeholder='Date'/>
				{/* <DateInput calendarProps={{size: 'small'}} format='dd/mm/yyyy' placeholder='End Date'/> */}
			</Box>
		</BaseModal>
	)
}