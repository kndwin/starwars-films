import create from 'zustand'
import { Film } from 'types'

type FilmStore = {
	films: Film[]
	setFilms: (films: Film[]) => void
}

export const useFilmStore = create<FilmStore>(set => ({
	films: [],
	setFilms: (films) => set({ films: films })
}))
