import { GetStaticProps } from 'next'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import { Film, DisplayFilms } from 'types'
import styles from 'styles/Home.module.scss'
import {useFilmStore} from 'store/filmsStore'
import Link from 'next/link'
import { Layout, Card } from 'components'

export default function Home({ 
  filmsProps
}: {
  filmsProps: Film[]
}) {
  const [films, setFilms] = useState<DisplayFilms[]>([])
  useEffect(() => {
		const displayFilms = filmsProps.map( ({ title, episode_id }) => ({
			title: title,
			id: episode_id,
			isVisible: true,
			isFavourite: false
		}))
    setFilms(displayFilms)
  }, [filmsProps])

	const { setFilms: setFilmsFromStore } = useFilmStore()
  useEffect(() => {
		setFilmsFromStore(filmsProps)
  }, [filmsProps, setFilmsFromStore])

	const [searchMessage, setSearchMessage] = useState<string>('')
	const setFilmVisiblity = (e: React.ChangeEvent) => {
    const searchTerm = (e.target as HTMLInputElement).value 
		// if searchTerm is empty, set all films to be visible
		setSearchMessage('')
		if (searchTerm.length == 0) {
			const resetFilmVisibility = films.map((film) => {
				return {...film, isVisible: true}
			})

			setFilms(resetFilmVisibility)
		} else {
			const fuse = new Fuse(films, {
				threshold: 0.2,  //https://fusejs.io/api/options.html#threshold
				keys: [`title`]
			})

			const filteredFilmsTitles = fuse.search(searchTerm)
				.map( ({ item }) =>  item.title)

			if (filteredFilmsTitles.length == 0 ) {
				setSearchMessage('😢 No Search found')
			}

			const updatedFilmVisibility = films.map((film) => {
				const isVisible = filteredFilmsTitles.includes(film.title)
				return {...film, isVisible}
			})
			

			setFilms(updatedFilmVisibility)
		}
  }

	const toggleFilmFavourite = (index: number) => (_: React.MouseEvent) => {
		let tmpFilms = [...films]
		tmpFilms[index].isFavourite = !tmpFilms[index].isFavourite
		setFilms(tmpFilms)

		let cacheFavourites = tmpFilms
			.filter(({ isFavourite }) => isFavourite)
			.map(({ title }) => title)
		localStorage.setItem("favouriteFilms", JSON.stringify(cacheFavourites))
	}

	return (
		<Layout>
			<div className={styles.main}>
				<input 
					className={`${styles.search}`}
					onChange={(e) => setFilmVisiblity(e)}
					type="text"
				/>
				<Card>
					{ searchMessage.length == 0
						? films?.sort((a,b) => a.isFavourite ? -1 : !b.isFavourite ? 1 : 0)
						.map( ({ title, isVisible, isFavourite }, index: number) => isVisible && (
							<div key={index}
								className={styles.row}>
								<button className={isFavourite ? styles.redHeart : ''} 
									onClick={(e) => toggleFilmFavourite(index)(e)}
								/>
								<h3>
									<Link href={`${title.toLowerCase().split(' ').join('-')}`}>
										{ title }
									</Link>
								</h3>
							</div>
						))
						: (
							<h3>
								{searchMessage}
							</h3>
						) 
					}
				</Card>
			</div>
		</Layout>
	)
}

export const getStaticProps: GetStaticProps = async (_) => {
  const res = await fetch('https://swapi.dev/api/films')
  const data: any = await res.json()
  return {
    props: {
      filmsProps: data.results
    }
  }
}
