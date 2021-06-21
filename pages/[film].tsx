import { useState, useEffect, useCallback} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {useFilmStore} from 'store/filmsStore'

import styles from 'styles/FilmPage.module.scss'
import { Film, Character } from 'types'
import { Layout, Card } from 'components'

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

	const [ characters, setCharacters ] = useState<Character[]>([])
	const [ loadingCharacters, setLoadingCharacters ] = useState<boolean>(false)
	const [ addingCharacter, setAddingCharacters ] = useState<boolean>(false)

	const fetchCharacter = useCallback(async () => {
		if (characters.length > 0 || selectedFilm == null) {
		} else {
			let charArr = []
			setLoadingCharacters(true)
			for await (let char of selectedFilm?.characters) {
				const res = await fetch(char)
				const json = await res.json()
				charArr.push(json)
				setAddingCharacters(true)
				setCharacters(charArr)
				setAddingCharacters(false)
			}
			setLoadingCharacters(false)
		}	
	}, [selectedFilm])

	useEffect(() => {
		fetchCharacter()
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
					<h3>{selectedFilm?.title}</h3>
					<small>
						{selectedFilm?.director}
					</small>
					<p>{selectedFilm?.opening_crawl}</p>
				</Card>
				<Card>
					<h3>
						Characters
					</h3>
					{
						loadingCharacters 
							?  (
								<div className={styles.loading}>
									<br />
									{ characters.length } loaded
									<p className={styles.loadingText}>
										Loading Characters
									</p>
								</div>
							) : (
								<div className={styles.characters}>
									{characters.map( ({ name }, index) => (
										<p className={styles.character} key={index}>{name}</p>
									))}
								</div>
							)
					}
				</Card>
			</div>
		</Layout>
	)
}
