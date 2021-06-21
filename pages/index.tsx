import { GetStaticProps, GetServerSideProps } from 'next'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import { Film, DisplayFilms } from 'types'
import styles from 'styles/Home.module.scss'

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

  function setFilmVisiblity(e: React.ChangeEvent) {
    const searchTerm = (e.target as HTMLInputElement).value 
		// if searchTerm is empty, set all films to be visible
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

			const updatedFilmVisibility = films.map((film) => {
				const isVisible = filteredFilmsTitles.includes(film.title)
				return {...film, isVisible}
			})

			setFilms(updatedFilmVisibility)
		}
  }

  return (
    <div className={styles.container}>
      <h1>
        🎞 Star war films
      </h1>
      <input 
        className={`${styles.search}`}
        onChange={(e) => setFilmVisiblity(e)}
        type="text"/>
      { films?.map( ({ title, isVisible, isFavourite }, index: number) => isVisible && (
        <h3 key={index}>
					{ isFavourite ? '⭐ ' : ''}
          { title }
        </h3>
      ))}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('https://swapi.dev/api/films')
  const data: any = await res.json()
  return {
    props: {
      filmsProps: data.results
    }
  }
}
