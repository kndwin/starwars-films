import styles from './Card.module.scss'

export default function Card({ children, ...props } : { children: React.ReactNode}) {
	return (
		<div className={styles.card}>
			{children}
		</div>
	)
}
