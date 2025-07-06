import styles from './index.module.scss'

function Loading() {

    return (
        <div className={styles.loading}>
            <div className={styles.spinner}>
            </div>
           
        </div>
    );
}

export default Loading;
