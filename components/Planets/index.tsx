import { useState } from 'react'

import cardStyles from 'components/Card/Card.module.scss'
import type { Planet } from 'types'

import { Card } from 'components'
import { useFetchData } from 'hooks'

export default function Planets({ urls } : { urls: string[] | undefined}) {

	const [ planets, setPlanets ] = useState<Planet[]>([])
	const [ loadingPlanets, setLoadingPlanets ] = useState<boolean>(false)
	const [ _, setAddingPlanets ] = useState<boolean>(false)

	useFetchData({
		setData: setPlanets,
		setLoading: setLoadingPlanets,
		setAdding: setAddingPlanets,
		urls: urls,
		data: planets
	})

	return (
		<Card>
			<h3>
				🌍 Planets
			</h3>
			{
				loadingPlanets 
					?  (
						<div className={cardStyles.loading}>
							<p className={cardStyles.loadingText}>
								{ planets.length } loaded
							</p>
						</div>
					) : (
						<div className={cardStyles.cardDetails}>
							{planets.map( ({ 
								name, rotation_period, orbital_period, diameter,
								climate, gravity, terrain, surface_water, population
							}, index) => (
								<p key={index}
									className={cardStyles.cardDetail} >
									{name}
									<div className={cardStyles.tooltipTop}>
										<strong>rotation period: {' '}</strong> {rotation_period}	<br />
										<strong>orbital period: {' '}</strong> {orbital_period}	<br />
										<strong>diameter: {' '}</strong> {diameter}	<br />
										<strong>climate: {' '}</strong> {climate}	<br />
										<strong>gravity: {' '}</strong> {gravity}	<br />
										<strong>terrain: {' '}</strong> {terrain}	<br />
										{ population !== 'unknown' && <div>
											<strong>population: </strong> {population} <br />
										</div>}
									</div>
								</p>
							))}
						</div>
					)
			}
		</Card>
	)
}
