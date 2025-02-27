import React, { useState } from 'react';
import { Box, Text, Button, List } from 'grommet';
import { useMutation, useQuery } from '@greenco/signage-api';
import { Add, List as ListIcon, Edit, Map as MapIcon } from 'grommet-icons';
import { CreateLocationModal } from '../../modals/create-location';
import { useNavigate } from 'react-router-dom'
import { LocationMap } from '../../components/location-map';

export interface LocationListProps {

}

export const LocationList : React.FC<LocationListProps> = (props) => {
	const navigate = useNavigate()

	const [ selected, setSelected ] = useState<any | null>(null)
	const [ modalOpen, openModal ] = React.useState(false);


	const [ view, setView ] = useState<string>('list');
	
	const query = useQuery()
	const locationGroups = query.locationGroups()
	const locations = query.locations()


	const [ createLocation, createInfo ] = useMutation((mutation, args: {name: string, machine: string}) => {

		const item = mutation.updateHiveOrganisations({
			update: {
				locationGroups: [{
					create: [{
						node: {
							name: args.name
						}
					}]
				}]
			}
		})
		// const item = mutation.createLocations({input: [{
		// 	name: args.name,
		// 	...machineUpdate
		// }]})
		return {
			item: {
				...item.hiveOrganisations?.[0]
			}
		}

	}, {
		awaitRefetchQueries: true,
		refetchQueries: [query.locationGroups()]
	})

	const [ updateLocation ] = useMutation((mutation, args: {id: string, name: string, machine: string}) => {

		const item = mutation.updateHiveOrganisations({
			update: {
				locationGroups: [{
					where: {node: {id: args.id}},
					update: {
						node: {
							name: args.name
						}
					}
				}]
			}
		})
		// const item = mutation.createLocations({input: [{
		// 	name: args.name,
		// 	...machineUpdate
		// }]})
		return {
			item: {
				...item.hiveOrganisations?.[0]
			}
		}

	}, {
		awaitRefetchQueries: true,
		refetchQueries: [query.locationGroups()]
	})

	const [ deleteLocation ] = useMutation((mutation, args: {id: string}) => {

		const item = mutation.updateHiveOrganisations({
			update: {
				locationGroups: [{
					delete: [{
						where: {node: {id: args.id}}
				
					}]
				}]
			}
		})
		// const item = mutation.createLocations({input: [{
		// 	name: args.name,
		// 	...machineUpdate
		// }]})
		return {
			item: {
				...item.hiveOrganisations?.[0]
			}
		}

	}, {
		awaitRefetchQueries: true,
		refetchQueries: [query.locationGroups()]
	})

	return (
		<Box
			round="xsmall"
			overflow="hidden"
			flex
			elevation="small"
			background="light-1"
			>
			
			<CreateLocationModal
				selected={selected}
				onClose={() => {
					openModal(false)
					setSelected(null)
				}}
				onSubmit={(cluster) => {
					if(cluster.id){
						updateLocation({
							args: {
								id: cluster.id,
								...cluster
							}
						}).then(() => {
							setSelected(null)
							openModal(false);
						})
					}else{
						createLocation({args: {
							...cluster
						}}).then(() => {
							openModal(false)
						})
					}
				}}
				onDelete={() => {
					if(!selected.id) return;
					deleteLocation({
						args: {
							id: selected.id
						}
					}).then(() => {
						openModal(false)
						setSelected(null)
					})
				}}
				open={modalOpen}
				/>
			<Box align="center" justify="between" direction="row" pad="xsmall" background="accent-2">
				<Text>Locations</Text>

				<Box direction='row' align='center'>
					<Button 
						hoverIndicator
						plain
						onClick={() => setView(view == 'list' ? 'map' : 'list')}
						style={{padding: 6, borderRadius: 3}}
						icon={view == 'list' ? (<ListIcon size="small"/>) : (<MapIcon size="small" />)} />
					<Button 
						hoverIndicator
						plain
						onClick={() => openModal(true)}
						style={{padding: 6, borderRadius: 3}}
						icon={<Add size="small" />}
						/>
				</Box>
			</Box>
			<Box flex>
				{view == 'list' ? (
							<List
								onClickItem={(ev) => navigate(`${ev.item.id}`)}
								primaryKey={"name"}
								data={locationGroups}>
								{(datum) => (
									<Box direction='row' align='center' justify='between'>
										<Text>{datum?.name}</Text>
										<Button 
											onClick={() => {
												openModal(true)
												setSelected(datum)
											}}
											plain
											hoverIndicator
											style={{padding: 6, borderRadius: 3}}
											icon={<Edit />} />
									</Box>
								)}
							</List>
				) : (
					<LocationMap markers={locations.map((x) => ({lat: x.lat || '0', lng: x.lng || '0'}))  || []} />
				)}
			</Box>

		</Box>
	)
}