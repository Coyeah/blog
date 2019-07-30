import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import { getBlogItem } from '@/services';
import Loadable from '@/components/Loadable';
import Footer from '@/components/Layout/Footer';
import useFetch from '@/components/useHooks/useFetch';
import history from '@/utils/history';
import styles from './index.module.less';
import {info} from '@/config';
import {env} from '@/env';

const Post: React.SFC = (props: any) => {
  const {location: {pathname}} = history;
  const [data, getData] = useFetch(getBlogItem, ({title, labels, body}) => ({title, labels, body}));
  const {computedMatch: {params: {number}}} = props;
  useEffect(() => {
    getData({number});
  }, []);

  const {data: dataSource = {}, status: {loading}} = data,
    title = dataSource.title || '', body = dataSource.body || '',
    labels = dataSource.labels || [];
  return (
    <Loadable loading={loading}>
      <h1>{title}</h1>
      {labels.map(({id, name}) => (<i key={id} className={styles.label}># {name}</i>))}
      <hr />
      <Markdown source={body} />
      <hr />
      <p>原文作者：<a href={info.github}>{info.author}</a></p>
      <p>原文链接：<a href={`${env.location}${pathname}`}>{`${env.location}${pathname}`}</a></p>
      <p>许可协议：<a href={info.licenses}>知识共享署名-非商业性使用 4.0 国际许可协议</a></p>
      <Footer />
    </Loadable>
  )
}

export default Post;