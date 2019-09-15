import Layout from '../components/Layout';
import styles from './index.less';

export default function Index() {
  return (
    <Layout>
      <div className={styles.layout}>
        <div className={styles.text}>
          Welcome to the <b>Personal Internet Domicile</b> of Coyeah
        </div>
        <div className={styles.block} />
      </div>
    </Layout>
  )
}
