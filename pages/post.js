import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import removeMarkdown from 'remove-markdown';
import _ from 'lodash/fp';
import Layout from '../components/Layout';
import Loadable from '../components/Loadable';
import SEO from '../components/SEO';
import { getBlogItem } from '../apis';
import { reader, useReader } from '../utils/leancloud';
import {website, env} from '../utils/config';
import styles from './post.less';

const truncate = _.compose(
  _.truncate({ length: 200 }),
  _.replace(/\n/g, ' '),
  removeMarkdown,
);

const extractImage = (str) => {
  const imageRe = /!\[.*?\]\((.+?)\)/g;
  const matchs = imageRe.exec(str);
  if (matchs) {
    return matchs[1];
  }
  return null;
};

const Post = (props) => {
  const { url: { query: { id }, asPath } } = props;
  const [{data, code}, getData] = getBlogItem(({title, body, labels}) => ({
    title, body, labels
  }));
  useEffect(() => {
    if (id && !data) {
      getData(id);
    }
  }, [id]);
  const [times, getTimes] = useReader();
  const { title = '', labels = [], body } = data || {};
  useEffect(() => {
    if (title) {
      reader(asPath, title);
      getTimes(title);
    }
  }, [title])
  return (
    <>
      <SEO
        subTitle={title}
        description={truncate(body)}
        canonical={`${env.location}${asPath}`}
        image={extractImage(body)}
      />
      <Layout title={title} width="65%" footer>
        <Loadable loading={code !== 2}>
          <h1>{title}</h1>
          <span className={styles.label}>已阅读 {times} 次</span>
          {labels.map(({id, name}) => (<i key={id} className={styles.label}># {name}</i>))}
          <hr />
          <div className={styles.markdown}>
            <Markdown source={body} />
          </div>
          <hr />
          <p>原文作者：<a href={website.github}>{website.author}</a></p>
          <p>原文链接：<a href={`${env.location}${asPath}`}>{`${env.location}${asPath}`}</a></p>
          <p>许可协议：<a href={website.licenses}>知识共享署名-非商业性使用 4.0 国际许可协议</a></p>
        </Loadable>
      </Layout>
    </>
  )
}

export default Post;