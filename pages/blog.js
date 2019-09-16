import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Loadable from '../components/Loadable';
import Link from '../components/Link';
import { getBlogTotal } from '../apis';
import { session } from '../utils/helper';
import styles from './blog.less';

const sessionKey = 'BLOG_TOTAL_SESSION_KEY';

const Blog = (props) => {
  const [{data, code}, getData, setData] = getBlogTotal(data => data.items.map(({title, number}) => ({
    title, number
  })));
  useEffect(() => {
    const data = session(sessionKey);
    if (data && data.length !== 0) {
      setData(data);
    } else {
      getData().then(data => {
        session(sessionKey, data);
      });
    }
  }, []);

  return (
    <Layout title="博文" footer>
      <Loadable loading={code === 0 ? false : code !== 2}>
        <ul>
          {data && data.map(({title, number}) => (
            <li key={number} className={styles['blog-item']}>
              <Link
                href='/post/[id]'
                as={`/post/${number}`}
                text={title}
              />
            </li>
          ))}
        </ul>
      </Loadable>
    </Layout>
  )
}

// Blog.getInitialProps = async function () {
//   const data = await getBlogTotal();
//   return {
//     list: data
//   };
// }

export default Blog;