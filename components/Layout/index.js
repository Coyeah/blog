import * as React from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import Link from '../Link';
import styles from './index.less';

const Footer = (props) => (
  <div className={styles.footer}>
    © 2018 - 2019  Coyeah Chen
  </div>
);

const Layout = ({ title, isLight = false, children, width, footer }) => {
  const cx = classNames(styles.layout, {
    [styles['layout-dark']]: isLight,
    [styles['layout-light']]: !isLight,
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
      <div className={styles.main} style={{width}}>
        {children}
      </div>
      {footer && <Footer />}
    </div>
  )
}

export default Layout;