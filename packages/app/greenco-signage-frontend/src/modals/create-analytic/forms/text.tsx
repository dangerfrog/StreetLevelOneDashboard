import { FormInput } from '@hexhive/ui';
import React, { useState } from 'react';
import { QRFormProps } from '.';


export const TextForm : React.FC<QRFormProps> = (props) => {

	const [ data, setData ] = useState<string>('')


	const onChange = (key: string, val: string) => {
		setData(val)
		props.onChange?.(val)
	}

	return (
		<>
		<FormInput
			value={data}
			onChange={(e) => onChange('message', e)}
			placeholder='Message' />
		</>	
	)
}