import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Layout/Footer';
import Loadable from '@/components/Loadable';
import { BlogContext, wrappedConsumer } from '@/components/Blog';
import styles from './index.module.less';

const Archives: React.SFC = (props: any) => {
  const { data } = useContext(BlogContext);

  const {data: dataSource = [], status: {loading}} = data;
  return (
    <Loadable loading={loading}>
      <ul className={styles.layout}>
        {dataSource.length > 0 && dataSource.map(({number, title}) => (
          <li key={number}><Link to={`/post/${number}`}>{title}</Link></li>
        ))}
      </ul>
      <Footer />
    </Loadable>
  )
}

export default Archives;