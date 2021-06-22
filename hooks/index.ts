import { useEffect, useCallback } from "react"

type FetchDataProp = {
	setData: (data: any) => void
	setLoading: (isLoad: boolean) => void
	setAdding: (isAdding: boolean) => void
	urls: string[] | undefined
	data: any[]
}

export const useFetchData = ({ 
	setData, setLoading, setAdding, urls, data
} : FetchDataProp) => {
	const fetchData = useCallback(async () => {
		if (data.length > 0 || urls == undefined) {
		} else {
			let tmpData = []
			setLoading(true)
			for await (let char of urls) {
				const res = await fetch(char)
				const json = await res.json()
				setAdding(true)
				tmpData.push(json)
				setData(tmpData)
				setAdding(false)
			}
			setLoading(false)
		}
	}, [urls])

	useEffect(() => {
		fetchData()
	}, [urls])
}
