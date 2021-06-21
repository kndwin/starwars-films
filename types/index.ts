export type Film = {
	title: string
	episode_id: number
	opening_crawl: string
	director: string
	release_date: string
	characters: string[]
	planets: string[]
	starships: string[]
	vehicles: string[]
	species: string[]
	created: string
	edited: string
	url: string
}

export type DisplayFilms = {
	title: string
	id: number
	isVisible: boolean
	isFavourite: boolean
}
