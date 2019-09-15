import * as React from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import Link from '../Link';
import styles from './index.less';

const Layout = ({title, isLight = false, children}) => {
  const cx = classNames(styles.layout, {
    [styles['layout-dark']]: !isLight,
    [styles['layout-light']]: isLight,
  });
  return (
    <div className={cx}>
      <Head>
        <title>{title ? `${title} | coyeah\'s blog` : 'coyeah\'s blog'}</title>
      </Head>
      <div className={styles.nav}>
        <div><Link href="/" text="coyeah" /></div>
        <div><Link href="/blog" text="blog" />, <Link href="/about" text="about" /></div>
      </div>
      <div className={styles.main}>
        {children}
      </div>
    </div>
  )
}

export default Layout;