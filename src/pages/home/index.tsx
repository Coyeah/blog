import React from 'react';
import styles from './index.module.less';

const Home: React.SFC = (props: any) => {
  return (
    <div className={styles.layout}>
      <div className={styles.text}>
        Welcome to the <b>Personal Internet Domicile</b> of Coyeah
      </div>
    </div>
  )
}

export default Home;