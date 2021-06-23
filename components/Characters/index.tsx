import { useState } from 'react'

import cardStyles from 'components/Card/Card.module.scss'
import { Card } from 'components'
import type { Character } from 'types'
import {useFetchData} from 'hooks'

export default function Characters({ urls } : { urls: string[] | undefined}) {

	const [ characters, setCharacters ] = useState<Character[]>([])
	const [ loadingCharacters, setLoadingCharacters ] = useState<boolean>(false)
	const [ _, setAddingCharacters ] = useState<boolean>(false)

	useFetchData({
		data: characters, 
		setData: setCharacters,
		setLoading: setLoadingCharacters,
		setAdding: setAddingCharacters,
		urls: urls
	})

	return (
		<Card>
			<h3>
				👨‍🎤 Characters
			</h3>
			{loadingCharacters ? (
				<div className={cardStyles.loading}>
					<p className={cardStyles.loadingText}>
						{ characters.length } / {urls?.length} loaded
					</p>
				</div>
			) : (
				<div className={cardStyles.cardDetails}>
					{characters.map( ({ 
						name, 
						eye_color, 
						skin_color, 
						birth_year, 
						gender, 
						mass
					}, index) => (
						<p key={index}
							className={cardStyles.cardDetail} >
							{name}
							<div className={cardStyles.tooltipBottom}>
								<strong>eyes: {' '}</strong> {eye_color}	<br />
								<strong>mass: {' '}</strong> {mass} <br />
								<strong>skin: {' '}</strong> {skin_color} <br />
								<strong>gender: {' '}</strong> {gender} <br />
								{ birth_year !== 'unknown' && <div>
									<strong>birrthday: </strong> {birth_year} <br />
								</div>}
							</div>
						</p>
					))}
				</div>
			)}
		</Card>
	)
}
