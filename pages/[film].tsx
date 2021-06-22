import { useState, useEffect, useCallback} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {useFilmStore} from 'store/filmsStore'

import styles from 'styles/FilmPage.module.scss'
import type { Film, Character } from 'types'
import { Layout, Card, Characters, Planets } from 'components'

export default function FilmPage()  {
	const router = useRouter()
	const { film: slug } = router.query
	const { films } = useFilmStore()
	const [ selectedFilm, setSelectedFilm ] = useState<Film>()
	const compareTitleToSlug = (title: string, slug: string | undefined) => {
		return title.toLowerCase().split(' ').join('-') == slug
	}

	useEffect(() => {
		let tmpFilm
		if (typeof slug === 'string') {
			tmpFilm = films.filter( ({ title }) => compareTitleToSlug(title, slug))
			setSelectedFilm(tmpFilm[0])
		}
	}, [selectedFilm])

	return (
		
		<Layout>
			<h3 className={styles.backLink}>
				<Link href='/'>
					↩ Go back
				</Link>
			</h3>
			<div className={styles.main}>
				<Card >
					<h3>🎞 Star Wars {selectedFilm?.episode_id} 
						{': '} {selectedFilm?.title}
					</h3>
					<small>
						<strong>
						Release date: {' '}
						</strong>
							{selectedFilm?.release_date}
					</small>
					<br />
					<small>
						<strong>
							Director: {' '}
						</strong>
						{selectedFilm?.director}
					</small>
					<br />
					<small>
						<strong>
							Producer: {' '}
						</strong>
						{selectedFilm?.producer}
					</small>
					<p>{selectedFilm?.opening_crawl}</p>
				</Card>
				<Characters urls={selectedFilm?.characters} />
				<Planets urls={selectedFilm?.planets} />
			</div>
		</Layout>
	)
}
