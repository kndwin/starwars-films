import { GetStaticProps, GetServerSideProps } from 'next'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'
import { Film } from 'types'
import styles from 'styles/Home.module.scss'

export default function Home({ 
  filmsProps
}: {
  filmsProps: Film[]
}) {
  const [films, setFilms] = useState<Film[]>([])
  const [filteredFilms, setFilteredFilms] = useState<string[]>([])
  useEffect(() => {
    console.log({ filmsProps})
    setFilms(filmsProps)
  }, [filmsProps])

  function filterOnChange(e: Event) {
    const searchTerm = (e.target as HTMLInputElement).value 
    const fuse = new Fuse(films, {
      threshold: 0.3,  //https://fusejs.io/api/options.html#threshold
      keys: [`title`]
    })
    const fuseFilter = fuse.search(searchTerm)
    const filter = fuseFilter.map( (fuse) =>  fuse.item.title)
    setFilteredFilms(filter)
    console.log(films)
    console.table({ filteredFilms })
    console.log(filteredFilms[films[0].title])
  }

  return (
    <div className={styles.container}>
      <h1>
        🎞 Star war films
      </h1>
      <input 
        className={`${styles.search}`}
        onChange={(e) => filterOnChange(e)}
        type="text"/>
      {films?.filter( (films: Film) => console.log(films.title))
        .map( (film: Film, i: number) => (
        <h3 key={i}>
          {film.title}
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
