import styles from './FeatInfo.module.css'
const FeatInfo = () => {
    return (
        <section className={styles.body}>
            <h1>All the tools for learning success</h1>
            <section className={styles.cont}>
                <div className={styles.InfoCard}>
                    <h1>Index card & Quiz Builder</h1>
                    <p>
                    To improve your study sessions, make personalized index cards and tests. Arrange essential ideas and assess your understanding to ensure efficient learning.
                    </p>
                </div>
                <div className={styles.InfoCard}>
                    <h1>Study Techniques</h1>
                    <p>
                    Techniques and strategies used to learn and retain information effectively. It can include activities like reviewing notes, using flashcards, practicing with quizzes, or teaching others to reinforce understanding.
                    </p>
                </div>
                <div className={styles.InfoCard}>
                    <h1>Class Feature & Virtual Notes</h1>
                    <p>
                    Online access and arrangement of lecture notes facilitates anytime review and study of important ideas. 
                    </p>
                </div>
                <div className={styles.InfoCard}>
                    <h1>Anatomy Graphs</h1>
                    <p>
                    The visual representations of the human body's structure. Use charts or diagrams to make complex anatomical relationships easier to understand. Key connections between the body's systems, organs, muscles, and bones are learned with their assistance.
                    </p>
                </div>
            </section>
        </section>
    );
}

export default FeatInfo;
