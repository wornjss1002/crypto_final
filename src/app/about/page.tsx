import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>팀 소개</h1>
        <p>본문 작성</p>
      </div>
      <div className={styles.videoContainer}></div>
    </div>
  )
}
