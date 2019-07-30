import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {getBlogList} from '@/services';
import Footer from '@/components/Layout/Footer';
import Loadable from '@/components/Loadable';
import useFetch from '@/components/useHooks/useFetch';
import styles from './index.module.less';

const Archives: React.SFC = (props: any) => {
  const [data, getData] = useFetch(getBlogList, (data: object[]) => data.map(v => ({title: v.title, number: v.number})));
  const [payload, setPayload] = useState({
    pageNumber: 1,
    pageSize: 100,
  });
  useEffect(() => {
    getData(payload);
  }, [payload]);

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