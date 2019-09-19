import Layout from '../components/Layout';
import SEO from '../components/SEO';
import styles from './index.less';

export default function Index() {
  return (
    <Layout isLight>
      <SEO />
      <div className={styles.layout}>
        <div className={styles.text}>
          Welcome to the <b>Personal Internet Domicile</b> of Coyeah
        </div>
        <div className={styles.block} />
      </div>
    </Layout>
  )
}
