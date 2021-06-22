import React from 'react'
import styles from './Layout.module.scss'

export default function Layout({ children } : { children: React.ReactNode}) {
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<h1>Star war films</h1>
				{children}
			</div>
		</div>
	)
}
